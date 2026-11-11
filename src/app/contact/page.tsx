import React from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Globe, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach out to the Eagle Technology founding team to discuss software development, web platforms, UI/UX design, AI automation, or digital transformation.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's discuss what you need to build"
        description="Whether you are exploring a custom software tool, a web platform, or workflow automation, send us the context and our founding team will respond thoughtfully."
        badge="Ethiopia · Global Ambition"
      />

      <section className="bg-[var(--color-warm-off-white)] py-16 md:py-24">
        <div className="section-padding grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Contact Information Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-[var(--color-soft-sand)] bg-white p-6">
              <h2 className="text-lg font-bold text-[var(--color-dark-brown)]">
                Official Contact Details
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted-brown)]">
                Contact channels below reflect our current early-stage placeholder values
                pending official domain and mailbox provisioning.
              </p>

              <div className="mt-6 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brown-gold)]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--color-dark-brown)]">Email</p>
                    <p className="text-[var(--color-muted-brown)]">
                      {SITE_CONFIG.contact.emailPlaceholder}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-brown-gold)]">
                      {SITE_CONFIG.contact.emailNotice}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brown-gold)]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--color-dark-brown)]">Location</p>
                    <p className="text-[var(--color-muted-brown)]">
                      {SITE_CONFIG.contact.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brown-gold)]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--color-dark-brown)]">
                      Social Channels
                    </p>
                    <p className="text-[var(--color-muted-brown)]">
                      {SITE_CONFIG.contact.socialNotice}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brown-gold)]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[var(--color-dark-brown)]">
                      How Inquiries Are Reviewed
                    </p>
                    <p className="text-[var(--color-muted-brown)]">
                      Our CEO and relevant technical or design leads review inquiries
                      collaboratively before scheduling discovery calls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Inquiry Form */}
          <div className="lg:col-span-8">
            <ContactForm initialService={params.service} />
          </div>
        </div>
      </section>
    </>
  );
}
