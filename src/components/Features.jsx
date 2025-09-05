export default function Features() {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-base-200 rounded">Fast development with Vite</div>
          <div className="p-4 bg-base-200 rounded">Design system with Tailwind + daisyUI</div>
          <div className="p-4 bg-base-200 rounded">Context-based state management</div>
        </div>
      </div>
    </section>
  )
}
