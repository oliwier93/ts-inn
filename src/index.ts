export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

// Reducer-like function for updating selected services.
export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    let updatedServices = [...previouslySelectedServices];

    switch (action.type) {
        case "Select":
            if (!updatedServices.includes(action.service)) {
                if (action.service === "BlurayPackage" && !updatedServices.some(service => service === "Photography" || service === "VideoRecording")) {
                    return updatedServices;
                }
                updatedServices.push(action.service);
            }
            break;
        case "Deselect":
            updatedServices = updatedServices.filter(service => service !== action.service);
            if ((action.service === "Photography" || action.service === "VideoRecording") &&
                !updatedServices.some(service => service === "Photography" || service === "VideoRecording")) {
                updatedServices = updatedServices.filter(service => service !== "TwoDayEvent" && service !== "BlurayPackage");
            }
            break;
        default:
            break;
    }

    return updatedServices;
};


// Function to calculate the price based on selected services and year.
export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = 0;
    let finalPrice = 0;

    const hasPhotography = selectedServices.includes("Photography");
    const hasVideoRecording = selectedServices.includes("VideoRecording");
    const hasWeddingSession = selectedServices.includes("WeddingSession");
    const hasBlurayPackage = selectedServices.includes("BlurayPackage");
    const hasTwoDayEvent = selectedServices.includes("TwoDayEvent");

    // Photography and video recording individual costs.
    const photographyCosts = { 2020: 1700, 2021: 1800, 2022: 1900 };
    const videoCosts = { 2020: 1700, 2021: 1800, 2022: 1900 };

    // Check for Photography
    if (hasPhotography) {
        basePrice += photographyCosts[selectedYear];
    }

    // Check for Video Recording
    if (hasVideoRecording) {
        basePrice += videoCosts[selectedYear];
    }

    // Check for combined discount for Photography + Video Recording
    if (hasPhotography && hasVideoRecording) {
        basePrice -= (photographyCosts[selectedYear] + videoCosts[selectedYear]);
        basePrice += { 2020: 2200, 2021: 2300, 2022: 2500 }[selectedYear];
    }

    // Check for Wedding Session costs
    if (hasWeddingSession) {
        if (selectedYear === 2022 && hasPhotography) {
            // It's free for 2022 with photography
        } else if (hasPhotography || hasVideoRecording) {
            basePrice += 300;
        } else {
            basePrice += 600;
        }
    }

    // Check for Blu-ray Package
    if (hasBlurayPackage && hasVideoRecording) {
        basePrice += 300;
    }

    // Check for Two-Day Event
    if (hasTwoDayEvent && (hasPhotography || hasVideoRecording)) {
        basePrice += 400;
    }

    // Set finalPrice to basePrice (adjustments can be added later if needed).
    finalPrice = basePrice;

    return { basePrice, finalPrice };
};
