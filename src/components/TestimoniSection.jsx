import { TestimoniCard } from "./TestimoniCard";

export const TestimoniSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Frangky Lanes",
      location: "Purwakarta",
      ulasan:
        "Tempatnya nyaman, bersih, strategis dan disini dokternya juga perawatnya sangat baik, komunikatif serta harganya juga oke. Recommended deh!",
    },
    {
      id: 2,
      name: "Natasya Maindoka",
      location: "Purwakarta",
      ulasan:
        "Dokternya ramah banget. Ruang periksa nyaman dan enak. Kalau konsul juga sabar banget dan menjelaskan informasi yang dibutuhkan. Sukses selalu Dental Care.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto bg-[#2b4c50] rounded-[2rem] p-8 md:p-12 mt-6 ">
      {/* Judul Section */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-wide">
        Testimoni Pasien
      </h2>

      {/* Layout Kartu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((item) => (
          <TestimoniCard
            key={item.id}
            name={item.name}
            location={item.location}
            ulasan={item.ulasan}
          />
        ))}
      </div>
    </section>
  );
};
