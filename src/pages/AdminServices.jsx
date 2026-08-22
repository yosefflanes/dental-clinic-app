import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";
import { BriefcaseMedical, Loader2, Plus, Trash2, Pen, X } from "lucide-react";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_active: true,
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/services");
      if (response && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data layanan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiRequest(`/services/${editId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        await apiRequest("/services", { method: "POST", body: formData });
      }
      closeModal();
      fetchServices();
    } catch (error) {
      alert(error.message || "Gagal menyimpan data layanan");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus layanan ini secara permanen?")) return;
    try {
      await apiRequest(`/services/${id}`, { method: "DELETE" });
      fetchServices();
    } catch (error) {
      alert(error.message || "Gagal menghapus layanan");
    }
  };

  const openEditModal = (service) => {
    setEditId(service.id);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price,
      is_active: service.is_active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: "", description: "", price: "", is_active: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#14b8a6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-slate-800 tracking-tight mb-1">
            Kelola Layanan
          </h1>
          <p className="text-slate-500 text-[16px]">
            Tambah, ubah, atau hapus daftar layanan medis klinik.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2b4c50] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#1f373a] transition-all shadow-md shadow-[#2b4c50]/20"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} /> Tambah Layanan
        </button>
      </div>

      {/* Table Container */}
      <div
        className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${isModalOpen ? "blur-[2px]" : ""}`}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <BriefcaseMedical className="w-5 h-5 text-[#14b8a6]" />
          <h2 className="text-lg font-bold text-slate-800 m-0">
            Daftar Layanan Tersedia
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  Nama Layanan
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  Deskripsi
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  Harga
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.length > 0 ? (
                services.map((srv) => (
                  <tr
                    key={srv.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-5 align-top">
                      <span className="block font-medium text-slate-800">
                        {srv.name}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <p className="text-[13px] text-slate-500 line-clamp-2 max-w-75 leading-relaxed">
                        {srv.description || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span
                        className={`block text-[15px] font-semibold ${srv.is_active ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        Rp {(Number(srv.price) || 0).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top text-center">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                          srv.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {srv.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Pen
                            className="w-4.5 h-4.5"
                            strokeWidth={2.5}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Hapus"
                        >
                          <Trash2
                            className="w-4.5 h-4.5"
                            strokeWidth={2.5}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Belum ada layanan terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[20px] w-full max-w-125 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
              <h3 className="text-[20px] font-bold text-slate-800 m-0">
                {editId ? "Ubah Data Layanan" : "Tambah Layanan Baru"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium text-slate-600 mb-2">
                  Nama Layanan
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] outline-none transition-all text-[15px]"
                  placeholder="Contoh: Tambal Gigi Estetik"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-slate-600 mb-2">
                  Deskripsi Layanan
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] outline-none transition-all text-[15px] resize-none"
                  placeholder="Tuliskan deskripsi singkat mengenai prosedur layanan..."
                ></textarea>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-slate-600 mb-2">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] outline-none transition-all text-[15px]"
                  placeholder="Contoh: 350000"
                />
              </div>

              {editId && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-[#14b8a6] rounded border-slate-300 focus:ring-[#14b8a6]"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-slate-600"
                  >
                    Layanan Aktif
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2b4c50] text-white rounded-xl hover:bg-[#1f373a] font-semibold transition-colors shadow-md shadow-[#2b4c50]/20"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
