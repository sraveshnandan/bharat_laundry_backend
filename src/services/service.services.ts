import ServiceModel, { ServiceDocument } from "../models/service.model";

// Async function for admin to create a new service
async function createServiceByAdmin(
  input: Record<string, any>,
  createdBy: string = ""
): Promise<ServiceDocument> {
  try {
    const newService = new ServiceModel({
      ...input,
      createdBy,
    });
    return await newService.save();
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Could not create service");
  }
}

// Async function to fetch all services
async function fetchAllServices(): Promise<ServiceDocument[]> {
  try {
    return await ServiceModel.find({}).sort({ createdAt: -1 }).populate("");
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Could not fetch services");
  }
}

// Async function to fetch a specific service by ID
async function fetchServiceById(
  serviceId: string
): Promise<ServiceDocument | null> {
  try {
    return await ServiceModel.findById(serviceId).populate("");
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    throw new Error("Could not fetch service");
  }
}

// Async function for admin to update an existing service
async function updateServiceByAdmin(
  serviceId: string,
  updates: {
    name?: string;
    description?: string;
    banner?: { public_id?: string; url?: string };
  },
  adminId: string
): Promise<ServiceDocument | null> {
  try {
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      throw new Error("Service not found");
    }
    if (service.createdBy.toString() !== adminId.toString()) {
      throw new Error("Not authorized to update this service");
    }
    const updatedService = await ServiceModel.findByIdAndUpdate(
      serviceId,
      { $set: updates },
      { new: true }
    );
    return updatedService;
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Could not update service");
  }
}

// Async function for admin to delete a service
async function deleteServiceByAdmin(
  serviceId: string,
  adminId: string // ID of the admin performing the deletion
): Promise<boolean> {
  try {
    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return false;
    }
    if (service.createdBy.toString() !== adminId.toString()) {
      throw new Error("Not authorized to delete this service");
    }
    const result = await ServiceModel.findByIdAndDelete(serviceId);
    return !!result;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Could not delete service");
  }
}

export const ServiceService = {
  createServiceByAdmin,
  fetchAllServices,
  fetchServiceById,
  deleteServiceByAdmin,
  updateServiceByAdmin,
};
