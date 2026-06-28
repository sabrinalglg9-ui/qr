'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4">Venta de Entradas</h1>
        <p className="text-center text-gray-600 mb-8">
          Sistema seguro de venta de entradas con código QR
        </p>

        <div className="space-y-4">
          <Link
            href="/comprar"
            className="block w-full bg-black text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-gray-800 transition"
          >
            Comprar Entrada
          </Link>

          <Link
            href="/scanner"
            className="block w-full bg-success text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-green-600 transition"
          >
            Escanear QR
          </Link>

          <Link
            href="/admin"
            className="block w-full bg-gray-200 text-black py-3 px-6 rounded-lg text-center font-semibold hover:bg-gray-300 transition"
          >
            Panel de Administración
          </Link>
        </div>
      </div>
    </div>
  );
}
