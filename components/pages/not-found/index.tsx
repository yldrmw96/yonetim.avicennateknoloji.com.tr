export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <h1 className="text-base font-bold">404 - Sayfa Bulunamadı</h1>
      <p className="text-xs">
        Aradığınız sayfa bulunamadı. Lütfen doğru URLyi kontrol edin.
      </p>
    </div>
  );
}