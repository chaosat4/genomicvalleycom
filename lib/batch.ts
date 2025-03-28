export function getBatchNumber(formData: any) {
    const { code, numberOfSamples, readRequired, basesRequired, servicesRequired, dataAnalysis, sequencingPlatform} = formData;
    let serviceCode = "";
    let dataAnalysisCode = "";
    let sequencingPlatformCode = "";

   
    if (servicesRequired === "Extraction, Library Preparation, QC, Sequencing, Data Analysis") {
        serviceCode = "A";
    }
    if (servicesRequired === "Library Preparation, QC, Sequencing, Data Analysis") {
        serviceCode = "B";
    }
    if (servicesRequired === "Library-QC, Sequencing, Data Analysis") {
        serviceCode = "C";
    }
    if (servicesRequired === "Data Analysis") {
        serviceCode = "D";
    }

    if (dataAnalysis === "Standard") {
        dataAnalysisCode = "S";
    }
    if (dataAnalysis === "Advanced") {
        dataAnalysisCode = "A";
    }
    if (dataAnalysis === "None") {
        dataAnalysisCode = "N";
    }

    if (sequencingPlatform === "MGI") {
        sequencingPlatformCode = "M";
    }
    if (sequencingPlatform === "Illumina") {
        sequencingPlatformCode = "I";
    }
    if (sequencingPlatform === "PacBio") {
        sequencingPlatformCode = "P";
    }
    if (sequencingPlatform === "Nanopore") {
        sequencingPlatformCode = "N";
    }
    

    let combinedCode = `${serviceCode}${sequencingPlatformCode}${dataAnalysisCode}`;

    

    return `${code}_${combinedCode}_${numberOfSamples}/${readRequired}${basesRequired}`;
}
