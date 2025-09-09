"use client";
import React, { useRef } from "react";

export default function ReceiptModal({ isOpen, onClose, appointment }) {
  const printableRef = useRef(null);
  if (!isOpen || !appointment) return null;

  const openPrintWindow = () => {
    const content = printableRef.current?.innerHTML || "";
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Appointment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            h1 { font-size: 20px; margin-bottom: 8px; }
            .meta { color: #555; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
            .label { font-weight: bold; }
            .box { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (d) => {
    try {
      const date = new Date(d);
      return isNaN(date.getTime()) ? String(d) : date.toLocaleString();
    } catch {
      return String(d);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Appointment Receipt</h2>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div ref={printableRef} className="space-y-3">
          <div className="box">
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Jamal Hospital" className="w-10 h-10 object-contain" />
              <div>
                <h1>Jamal Hospital</h1>
                <div className="meta">Thank you for booking your appointment.</div>
              </div>
            </div>
            <div className="grid">
              <div className="label">Receipt ID</div>
              <div>{appointment._id || appointment.id || "-"}</div>
              <div className="label">Patient</div>
              <div>{appointment.firstName} {appointment.lastName}</div>
              <div className="label">Phone</div>
              <div>{appointment.phone}</div>
              <div className="label">Email</div>
              <div>{appointment.email || "-"}</div>
              <div className="label">Department</div>
              <div>{appointment.departmentId?.name || appointment.department?.name || "-"}</div>
              <div className="label">Doctor</div>
              <div>
                {appointment.doctorId?.firstName || appointment.doctor?.firstName || ""}
                {" "}
                {appointment.doctorId?.lastName || appointment.doctor?.lastName || ""}
              </div>
              <div className="label">Appointment Date</div>
              <div>{formatDate(appointment.appointmentDate)}</div>
              <div className="label">Appointment Time</div>
              <div>{appointment.appointmentTime || "-"}</div>
              <div className="label">Disease / Problem</div>
              <div>{appointment.disease || "-"}</div>
              <div className="label">Created At</div>
              <div>{formatDate(appointment.createdAt)}</div>
            </div>
          </div>

          <div className="box">
            <h1>Terms and Conditions</h1>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Please arrive 10–15 minutes before your scheduled time.</li>
              <li>Bring a valid ID and previous medical records if available.</li>
              <li>Appointment times may vary based on emergency cases.</li>
              <li>Fees are subject to change and are payable at reception.</li>
              <li>For rescheduling, contact the hospital at least 24 hours in advance.</li>
              <li>By booking, you consent to hospital policies and data processing.</li>
              <li>This is a computer generated receipt and is not a physical receipt.</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={openPrintWindow}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}


