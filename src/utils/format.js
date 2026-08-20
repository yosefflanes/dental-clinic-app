export const formatRupiah = (angka) => {
    if (!angka) return "Rp. 0";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR", 
        minimumFractionDigits: 0,
    }).format(angka);
};