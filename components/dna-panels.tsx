import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DNAPanels() {
  return (
    <div className="min-h-screen bg-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-600">
              DNA Panel Solutions
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Explore our comprehensive selection of DNA Panels designed to support clinical diagnostics, targeted
              therapy, and advanced genetic research. Our panels include targeted gene analyses for various cancers,
              inherited diseases, and solid tumors, providing precise genetic insights crucial for patient care and
              personalized medicine.
            </p>
            <p className="text-lg text-gray-700">
              Each panel is curated to cover relevant genes associated with specific conditions, facilitating accurate
              detection and informed clinical decisions.
            </p>
          </div>

          <Tabs defaultValue="human" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-purple-200">
              <TabsTrigger value="human" className="text-sm md:text-base">
                Human DNA Panels
              </TabsTrigger>
              <TabsTrigger value="pro" className="text-sm md:text-base">
                DNA Pro Panels
              </TabsTrigger>
              <TabsTrigger value="ultra" className="text-sm md:text-base">
                DNA Ultra Panels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="human">
              <div className="bg-white  rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-600">Human DNA Panels</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Available Human DNA Panels</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70%]">Panel Name</TableHead>
                        <TableHead className="text-right">Number of Genes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Human Breast Cancer Panel</TableCell>
                        <TableCell className="text-right">93</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human Colorectal Cancer Panel</TableCell>
                        <TableCell className="text-right">71</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human Myeloid Neoplasms Panel</TableCell>
                        <TableCell className="text-right">141</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human Lung Cancer Panel</TableCell>
                        <TableCell className="text-right">72</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human Inherited Disease Panel</TableCell>
                        <TableCell className="text-right">298</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human Comprehensive Cancer Panel</TableCell>
                        <TableCell className="text-right">275</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human Actionable Solid Tumor Panel</TableCell>
                        <TableCell className="text-right">22</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human BRCA1 and BRCA2 Panel</TableCell>
                        <TableCell className="text-right">2</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human BRCA1 and BRCA2 Plus Panel</TableCell>
                        <TableCell className="text-right">6</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human HRR Panel</TableCell>
                        <TableCell className="text-right">15</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human TMB and MSI Panel</TableCell>
                        <TableCell className="text-right">486</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pro">
              <div className="bg-white  rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-600">DNA Pro Panels</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Available DNA Pro Panels</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70%]">Pro Panel Name</TableHead>
                        <TableHead className="text-right">Number of Genes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Comprehensive Cancer Research Panel</TableCell>
                        <TableCell className="text-right">225</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Breast Cancer Research Panel</TableCell>
                        <TableCell className="text-right">54</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Colorectal Cancer Research Panel</TableCell>
                        <TableCell className="text-right">76</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Myeloid Neoplasms Research Panel</TableCell>
                        <TableCell className="text-right">164</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Brain Cancer Research Panel</TableCell>
                        <TableCell className="text-right">50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Lung Cancer Research Panel</TableCell>
                        <TableCell className="text-right">76</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Comprehensive Cancer Focus Panel</TableCell>
                        <TableCell className="text-right">164</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Breast Cancer Focus Panel</TableCell>
                        <TableCell className="text-right">36</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Colorectal Cancer Focus Panel</TableCell>
                        <TableCell className="text-right">53</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Myeloid Neoplasms Focus Panel</TableCell>
                        <TableCell className="text-right">92</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Brain Cancer Focus Panel</TableCell>
                        <TableCell className="text-right">26</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Lung Cancer Focus Panel</TableCell>
                        <TableCell className="text-right">44</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Comprehensive Hereditary Cancer Research Panel</TableCell>
                        <TableCell className="text-right">287</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hereditary Breast and Ovarian Cancer Panel</TableCell>
                        <TableCell className="text-right">50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hereditary Colorectal Cancer Panel</TableCell>
                        <TableCell className="text-right">44</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hematologic Malignancy Panel</TableCell>
                        <TableCell className="text-right">33</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hereditary Prostate Cancer Panel</TableCell>
                        <TableCell className="text-right">23</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hereditary Pancreatic Cancer Panel</TableCell>
                        <TableCell className="text-right">32</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ultra">
              <div className="bg-white  rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-600">DNA Ultra Panels</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Available DNA Ultra Panels</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70%]">Ultra Panel Name</TableHead>
                        <TableHead className="text-right">Number of Genes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Breast Cancer Research Panel</TableCell>
                        <TableCell className="text-right">14</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Colorectal Cancer Research Panel</TableCell>
                        <TableCell className="text-right">27</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Human Lung Cancer Panel</TableCell>
                        <TableCell className="text-right">26</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

