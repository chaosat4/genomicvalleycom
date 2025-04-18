"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { calculatePrice, usePriceList } from "@/lib/price";
import { generateQuotationPDF } from "@/components/QuotationPDF";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { sendQuotationEmail } from "@/app/actions/quotation";
import { getBatchNumber } from "@/lib/batch";

interface Service {
  documentId: string;
  categoryName: string;
  mainContent: {
    contentTitle: string;
    contentDescription: string;
    servicesHeading?: string;
    servicesList: {
      number: string;
      title: string;
      details: {
        detailsItem: string;
      }[];
    }[];
  };
}

interface FormData {
  name: string;
  institution: string;
  address: string;
  phone: string;
  email: string;
  serviceCategory: string;
  servicesRequired: string;
  serviceName: string;
  speciesName: string;
  speciesNameOther: string;
  tissueName: string;
  tissueNameOther: string;
  numberOfSamples: string;
  readRequired: string;
  readRequiredOther: string;
  basesRequired: string;
  basesRequiredOther: string;
  kitName: string;
  code: string;
  readLength: string;
  readLengthOther: string;
  sequencingPlatform: string;
  dataAnalysis: string;
  panel: string[];
  shortRead: string;
  longRead: string;
  shortReadBaseRequired: number;
  longReadBaseRequired: number;
  hicBaseRequired: number;
}

const GET_SERVICE = gql`
  query GetService($documentId: ID!) {
    service(documentId: $documentId) {
      documentId
      categoryName
      mainContent {
        contentTitle
        contentDescription
        servicesHeading
        servicesList {
          number
          title
          details {
            detailsItem
          }
          kitName
          code
        }
      }
    }
  }
`;

const GET_PANELS = gql`
  query {
    panels(pagination: { limit: 100 }) {
      documentId
      name
      genes
    }
  }
`;

const QuotationForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { priceList, loading, error } = usePriceList();
  const {
    loading: serviceLoading,
    error: serviceError,
    data,
  } = useQuery(GET_SERVICE, {
    variables: { documentId: id },
  });
  const { data: panelsData } = useQuery(GET_PANELS);
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    name: "",
    institution: "",
    address: "",
    phone: "",
    email: "",
    // Technical Details
    serviceCategory: "",
    servicesRequired: "",
    serviceName: "",
    speciesName: "",
    speciesNameOther: "",
    tissueName: "",
    tissueNameOther: "",
    numberOfSamples: "",
    readRequired: "",
    readRequiredOther: "",
    basesRequired: "",
    basesRequiredOther: "",
    kitName: "",
    code: "",
    readLength: "",
    readLengthOther: "",
    sequencingPlatform: "",
    dataAnalysis: "",
    panel: [],
    shortRead: "",
    longRead: "",
    shortReadBaseRequired: 0,
    longReadBaseRequired: 0,
    hicBaseRequired: 0,
  });

  const readRequiredServices = ["Gene Expression Analysis", "Epigenetics"];

  const readRequiredServiceName = [
    "16S rRNA Gene Sequencing",
    "Meta-Transcriptomics",
  ];

  const service = data?.service;
  const isCustomService =
    service?.mainContent.contentTitle ===
    "Customized Options tailored to your needs";
  const isReadRequiredService =
    (service?.mainContent.contentTitle &&
      readRequiredServices.includes(service.mainContent.contentTitle)) ||
    (formData.serviceName &&
      readRequiredServiceName.includes(formData.serviceName));
  const isCancerGenomics =
    service?.mainContent.contentTitle === "Cancer Genomics";
  const isGenomeAssembly =
    service?.mainContent.contentTitle === "Genome Assembly";

  const [expectedGenomeSize, setExpectedGenomeSize] = useState("");
  const [illuminaOther, setIlluminaOther] = useState<number | null>(null);
  const [nanoporeOther, setNanoporeOther] = useState<number | null>(null);
  const [hicOther, setHicOther] = useState<number | null>(null);

  useEffect(() => {
    if (isGenomeAssembly && expectedGenomeSize) {
      const shortReadBase = illuminaOther !== null 
        ? illuminaOther 
        : Number(expectedGenomeSize) * (100 / 1000);
      
      const longReadBase = nanoporeOther !== null 
        ? nanoporeOther 
        : Number(expectedGenomeSize) * (30 / 1000);
      
      const hicBase = hicOther !== null 
        ? hicOther 
        : Number(expectedGenomeSize) * (30 / 1000);

      setFormData(prev => ({
        ...prev,
        shortReadBaseRequired: shortReadBase,
        longReadBaseRequired: longReadBase,
        hicBaseRequired: hicBase
      }));
    }
  }, [expectedGenomeSize, illuminaOther, nanoporeOther, hicOther, isGenomeAssembly]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Special handling for custom service requests
    console.log({
      serviceId: id,
      serviceRequired: formData.servicesRequired,
      serviceName: service?.mainContent.contentTitle,
      type: "Custom Service Request",
      customRequirements: {
        serviceName: formData.serviceName,
        species: formData.speciesName,
        tissue: formData.tissueName,
        numberOfSamples: formData.numberOfSamples,
        sequencingDetails: {
          platform: formData.sequencingPlatform,
          readLength: formData.readLength,
          ...(isReadRequiredService
            ? { readsRequired: formData.readRequired }
            : { basesRequired: formData.basesRequired }),
        },
        dataAnalysis: formData.dataAnalysis,
      },
      contactInfo: {
        name: formData.name,
        institution: formData.institution,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
      },
      timestamp: new Date().toISOString(),
      priority: "High",
      status: "Needs Review",
    });

    // router.push("/request-quotation/custom-success");
  };

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate read/base requirements
      if (!isGenomeAssembly) {
        const hasReadRequirement = formData.readRequired && formData.readRequired !== '';
        const hasBaseRequirement = formData.basesRequired && formData.basesRequired !== '';
        const hasReadOther = formData.readRequired === 'other' && formData.readRequiredOther && formData.readRequiredOther !== '';
        const hasBaseOther = formData.basesRequired === 'other' && formData.basesRequiredOther && formData.basesRequiredOther !== '';

        if (!hasReadRequirement && !hasBaseRequirement) {
          toast({
            title: "Error",
            description: "Please specify either read or base requirements",
            variant: "destructive",
          });
          return;
        }

        if ((formData.readRequired === 'other' && !hasReadOther) || 
            (formData.basesRequired === 'other' && !hasBaseOther)) {
          toast({
            title: "Error",
            description: "Please specify the required value",
            variant: "destructive",
          });
          return;
        }
      }

      const kitName = service.mainContent.servicesList.find(
        (serviceItem: {
          number: string;
          title: string;
          details: { detailsItem: string }[];
        }) => serviceItem.title === formData.serviceName
      )?.kitName;
      const code = service.mainContent.servicesList.find(
        (serviceItem: {
          number: string;
          title: string;
          details: { detailsItem: string }[];
        }) => serviceItem.title === formData.serviceName
      )?.code;
      const serviceCategory = service.mainContent.contentTitle;

      // add kitName to formData
      formData.kitName = kitName;
      formData.code = code;
      //pass technical details to calculatePrice
      const { priceBeforeGST, totalPrice, gstPercentage, bulkDiscount } =
        calculatePrice(
          service?.mainContent.contentTitle,
          formData,
          priceList
        ) || {
          priceBeforeGST: 0,
          totalPrice: 0,
          gstPercentage: 0,
          bulkDiscount: 0,
        };

      const shortId = uuidv4().substring(0, 8);
      const quotationNumber = `GVPBQ_${format(
        new Date(),
        "yyyyMMdd"
      )}_${shortId}`;
      const batchNumber = getBatchNumber(formData);

      // generate quotation pdf
      const quotation = await generateQuotationPDF(
        priceBeforeGST,
        totalPrice,
        gstPercentage,
        bulkDiscount,
        formData,
        service?.mainContent.contentTitle,
        quotationNumber,
        batchNumber
      );

      // Send email to customer with quotation pdf link using server action
      await sendQuotationEmail(formData.email, quotation.fileUrl || "", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        address: formData.address,
      });

      if (quotation.success) {
        // Show success message using toast
        toast({
          title: "Success",
          description:
            "Quotation generated successfully! The PDF will download automatically.",
        });

        // Redirect to service page
        router.push("/services");
      } else {
        throw new Error("Failed to generate quotation");
      }
    } catch (error) {
      console.error("Error generating quotation:", error);
      toast({
        title: "Error",
        description: "Failed to generate quotation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = isCustomService
    ? handleCustomSubmit
    : handleStandardSubmit;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    if (e.target.name === "panel") {
      // Handle multiple select for panels
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions).map(
        (option) => option.value
      );
      setFormData({
        ...formData,
        panel: selectedOptions,
      });
    } else {
      // Handle other form fields as before
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (loading) {
    return (
      <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-2xl text-red-800">
          Error loading service details
        </div>
      </div>
    );
  }

  // fetch kitName from service.mainContent.servicesList

  return (
    <div className="min-h-screen bg-purple-50 to-white mt-40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            {service.mainContent.contentTitle}
          </h1>
          <p className="text-gray-600 mb-6">
            {service.mainContent.contentDescription}
          </p>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <div className="space-y-6">
            {/* Service Required */}
            <div>
              <div>
                <label
                  htmlFor="servicesRequired"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Required
                </label>
              </div>
              <select
                id="servicesRequired"
                name="servicesRequired"
                value={formData.servicesRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Services Required</option>
                <option value="Extraction, Library Preparation, QC, Sequencing, Data Analysis">
                  Extraction, Library Preparation, QC, Sequencing, Data Analysis
                </option>
                <option value="Library Preparation, QC, Sequencing, Data Analysis">
                  Library Preparation, QC, Sequencing, Data Analysis
                </option>
                <option value="Library-QC, Sequencing, Data Analysis">
                  Library-QC, Sequencing, Data Analysis
                </option>
                <option value="Data Analysis">Data Analysis</option>
              </select>
            </div>

            {/* Service Name */}
            <div>
              <label
                htmlFor="serviceName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Name
              </label>
              <select
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Service</option>
                {service.mainContent.servicesList?.map(
                  (serviceItem: {
                    number: string;
                    title: string;
                    details: { detailsItem: string }[];
                  }) => (
                    <option key={serviceItem.number} value={serviceItem.title}>
                      {serviceItem.title}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Species Name */}
            <div>
              <label
                htmlFor="speciesName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Species Name
              </label>
              {isCustomService ? (
                <input
                  type="text"
                  id="speciesName"
                  name="speciesName"
                  value={formData.speciesName}
                  onChange={handleChange}
                  placeholder="Enter species name"
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              ) : (
                <>
                  <select
                    id="speciesName"
                    name="speciesName"
                    value={formData.speciesName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Species</option>
                    <option value="human">Human</option>
                    <option value="plant">Plant</option>
                    <option value="animal">Animal</option>
                    <option value="bacteria">Bacteria</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.speciesName === "other" && (
                    <input
                      type="text"
                      id="speciesNameOther"
                      name="speciesNameOther"
                      value={formData.speciesNameOther}
                      onChange={handleChange}
                      placeholder="Please specify species"
                      className="mt-2 w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  )}
                </>
              )}
            </div>

            {/* Tissue Name */}
            <div>
              <label
                htmlFor="tissueName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tissue Name
              </label>
              {isCustomService ? (
                <input
                  type="text"
                  id="tissueName"
                  name="tissueName"
                  value={formData.tissueName}
                  onChange={handleChange}
                  placeholder="Enter tissue name"
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              ) : (
                <>
                  <select
                    id="tissueName"
                    name="tissueName"
                    value={formData.tissueName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Tissue</option>
                    <option value="blood">Blood</option>
                    <option value="root">Root</option>
                    <option value="stem">Stem</option>
                    <option value="skin">Skin</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.tissueName === "other" && (
                    <input
                      type="text"
                      id="tissueNameOther"
                      name="tissueNameOther"
                      value={formData.tissueNameOther}
                      onChange={handleChange}
                      placeholder="Please specify tissue type"
                      className="mt-2 w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  )}
                </>
              )}
            </div>

            {/* Number of Samples */}
            <div>
              <label
                htmlFor="numberOfSamples"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Samples
              </label>
              <input
                type="number"
                id="numberOfSamples"
                name="numberOfSamples"
                value={formData.numberOfSamples}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Read/Bases Required */}
            {!isGenomeAssembly && (
              <div>
                <label
                  htmlFor={
                    isReadRequiredService ? "readRequired" : "basesRequired"
                  }
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {isReadRequiredService
                    ? "Read Required / Per Sample (M)"
                    : "Bases Required / Per Sample (GB)"}
                </label>
                {isCustomService ? (
                  <input
                    type="text"
                    id={
                      isReadRequiredService ? "readRequired" : "basesRequired"
                    }
                    name={
                      isReadRequiredService ? "readRequired" : "basesRequired"
                    }
                    value={
                      isReadRequiredService
                        ? formData.readRequired
                        : formData.basesRequired
                    }
                    onChange={handleChange}
                    placeholder={
                      isReadRequiredService
                        ? "Enter reads required in millions (M)"
                        : "Enter bases required in gigabases (GB)"
                    }
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <>
                    {isReadRequiredService ? (
                      <>
                        <select
                          id="readRequired"
                          name="readRequired"
                          value={formData.readRequired}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="">Select Read Required</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                          <option value="50">50</option>
                          <option value="other">Other</option>
                        </select>
                        {formData.readRequired === "other" && (
                          <input
                            type="text"
                            id="readRequiredOther"
                            name="readRequiredOther"
                            value={formData.readRequiredOther}
                            onChange={handleChange}
                            placeholder="Please specify read required in millions (M)"
                            className="mt-2 w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <select
                          id="basesRequired"
                          name="basesRequired"
                          value={formData.basesRequired}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="">Select Bases Required</option>
                          <option value="1">1</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="30">30</option>
                          <option value="other">Other</option>
                        </select>
                        {formData.basesRequired === "other" && (
                          <input
                            type="text"
                            id="basesRequiredOther"
                            name="basesRequiredOther"
                            value={formData.basesRequiredOther}
                            onChange={handleChange}
                            placeholder="Please specify bases required in gigabases (GB)"
                            className="mt-2 w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Read Length */}
            <div>
              <label
                htmlFor="readLength"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Read Length (Optional)
              </label>
              {isCustomService ? (
                <input
                  type="text"
                  id="readLength"
                  name="readLength"
                  value={formData.readLength}
                  onChange={handleChange}
                  placeholder="Enter read length (e.g., PE-150x2)"
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              ) : (
                <>
                  <select
                    id="readLength"
                    name="readLength"
                    value={formData.readLength}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="PE-150x2">PE-150 x 2</option>
                    <option value="PE-50x2">PE-50 x 2</option>
                    <option value="PE-100x2">PE-100 x 2</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.readLength === "other" && (
                    <input
                      type="text"
                      id="readLengthOther"
                      name="readLengthOther"
                      value={formData.readLengthOther}
                      onChange={handleChange}
                      placeholder="Please specify read length"
                      className="mt-2 w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  )}
                </>
              )}
            </div>

            {isGenomeAssembly && (
              <div>
                <label
                  htmlFor="expectedGenomeSize"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expected Genome Size (MB)
                </label>
                <input
                  type="number"
                  id="expectedGenomeSize"
                  name="expectedGenomeSize"
                  value={expectedGenomeSize}
                  onChange={(e) => setExpectedGenomeSize(e.target.value)}
                  placeholder="Enter expected genome size in megabases (MB)"
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            )}
            {/* Sequencing Platform */}
            {isGenomeAssembly ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sequencing Platform
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <select
                      name="shortRead"
                      value={formData.shortRead}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Illumina/MGI</option>
                      <option value="Illumina">Illumina</option>
                      <option value="MGI">MGI</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={expectedGenomeSize ? Number(expectedGenomeSize) * (100 / 1000) : 0}
                      readOnly
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="ml-2">GB</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder="Other"
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        setIlluminaOther(value);
                      }}
                    />
                    <span className="ml-2">GB</span>
                  </div>

                  <div className="flex items-center">
                    <select
                      name="longRead"
                      value={formData.longRead}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Nanopore/PacBio</option>
                      <option value="Nanopore">Nanopore</option>
                      <option value="PacBio">PacBio</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={expectedGenomeSize ? Number(expectedGenomeSize) * (30 / 1000) : 0}
                      readOnly
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="ml-2">GB</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder="Other"
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        setNanoporeOther(value);
                      }}
                    />
                    <span className="ml-2">GB</span>
                  </div>

                  <div className="flex items-center">
                    <span>Hi-C</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={expectedGenomeSize ? Number(expectedGenomeSize) * (30 / 1000) : 0}
                      readOnly
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="ml-2">GB</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder="Other"
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        setHicOther(value);
                      }}
                    />
                    <span className="ml-2">GB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="sequencingPlatform"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sequencing Platform
                </label>
                {isCustomService ? (
                  <input
                    type="text"
                    id="sequencingPlatform"
                    name="sequencingPlatform"
                    value={formData.sequencingPlatform}
                    onChange={handleChange}
                    placeholder="Enter sequencing platform"
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                ) : (
                  <select
                    id="sequencingPlatform"
                    name="sequencingPlatform"
                    value={formData.sequencingPlatform}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="MGI">MGI</option>
                    <option value="Illumina">Illumina</option>
                    <option value="PacBio">PacBio</option>
                    <option value="Nanopore">Nanopore</option>
                  </select>
                )}
              </div>
            )}

            {/* Data Analysis */}
            <div>
              <label
                htmlFor="dataAnalysis"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data Analysis
              </label>
              {isCustomService ? (
                <input
                  type="text"
                  id="dataAnalysis"
                  name="dataAnalysis"
                  value={formData.dataAnalysis}
                  onChange={handleChange}
                  placeholder="Enter data analysis requirements"
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              ) : (
                <select
                  id="dataAnalysis"
                  name="dataAnalysis"
                  value={formData.dataAnalysis}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Analysis Type</option>
                  <option value="standard">Standard</option>
                  <option value="advanced">Advanced</option>
                  <option value="none">None</option>
                </select>
              )}
            </div>

            {/* Panel - Only show for Cancer Genomics */}
            {isCancerGenomics && (
              <div>
                <label
                  htmlFor="panel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Panel (Hold Ctrl/Cmd to select multiple)
                </label>
                <select
                  id="panel"
                  name="panel"
                  multiple
                  value={formData.panel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                  required
                >
                  <option value="">No Panel Required</option>
                  {panelsData?.panels?.map(
                    (panel: {
                      documentId: string;
                      name: string;
                      genes: string;
                    }) => (
                      <option key={panel.documentId} value={panel.name}>
                        {panel.name} - {panel.genes} genes
                      </option>
                    )
                  )}
                </select>
                {formData.panel.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected panels: {formData.panel.join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* Personal Information Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Quote should be in the name of
              </h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Institution */}
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Institution
                  </label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
              >
                Request Quotation
              </button>
            </div>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default QuotationForm;
