export default function Header() {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center mb-2">
        <img src="/logo-512.png" width={35} />
        <h1 className="text-3xl font-semibold text-white">Anki Auto</h1>
      </div>
      <p className=" text-sm text-[#707070]">
        Japanese Vocabulary Card Translator
      </p>
    </header>
  );
}
