import connectionToDb from "@/app/lib/mongoose";
import patientsModel from "../../../../../../Models/patients.model.js";

export async function PUT(request, { params }) {
  await connectionToDb();

  const { id } = params;
  const { checked } = await request.json();

  try {
    const updatedPatient = await patientsModel.findByIdAndUpdate(
      id,
      { checked },
      { new: true }
    );
    return new Response(
      JSON.stringify({ success: true, data: updatedPatient }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}
