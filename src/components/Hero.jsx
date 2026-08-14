const Hero = () => {
  return (
    <section className="w-full h-150 flex items-center px-6 md:px-32 pt-28 pb-10 bg-[url('/hero.jpg')] bg-cover bg-no-repeat bg-top">
      <div className="absolute inset-0 bg-black/30 h-150"></div>

      {/* 'relative z-10' agar teks berada di atas overlay */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-white text-2xl md:text-5xl font-bold leading-tight drop-shadow-lg">
          Senyum sehat, <span className="text-[#F9B637]"><i>dimulai hari ini</i></span>
        </h1>

        <p className="text-white text-lg drop-shadow-md max-w-xl">
          Perawatan gigi modern tanpa prosedur yang membingungkan. Kami berfokus
          penuh pada hasil terbaik, kenyamanan maksimal, dan harga yang pas
          untuk Anda.
        </p>
      </div>
    </section>
  );
};

export default Hero;
