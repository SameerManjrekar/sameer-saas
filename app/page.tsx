export default function Home() {
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 bg-secondary rounded-full">
              <span className="text-sm font-medium text-primary">
                Sort your notes easily
              </span>
            </span>
            <h1 className="mt-8 text-3xl lg:text-6xl font-extrabold tracking-tight">
              Create Notes with ease
            </h1>
            <p className="mt-8 text-base max-w-xl mx-auto lg:text-xl text-secondary-foreground">
              This is Sameer SaaS application where you can have a subscription
              model based on our pricing policy. To know more please subscribe
              to our plans.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
