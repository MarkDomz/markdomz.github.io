import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { fadeUp } from "../../animations/variants";
import { Section } from "../ui/Section";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    // Note: You must generate your access key from https://web3forms.com/ using markdomz14@gmail.com
    formData.append("access_key", "7e980e7a-487b-4b79-a63c-9e2b55106b37");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        console.log("Success", res);
        event.currentTarget.reset();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" eyebrow="Contact" title="Bring me the system that needs to feel serious.">
      <motion.form variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} onSubmit={onSubmit} className="mt-12 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-violet backdrop-blur-xl sm:grid-cols-2">
        <input name="name" className="form-field" placeholder="Name" required />
        <input name="email" className="form-field" placeholder="Email" type="email" required />
        <input name="project_type" className="form-field sm:col-span-2" placeholder="Project type" />
        <textarea name="message" className="form-field min-h-36 resize-none sm:col-span-2" placeholder="What are we building?" required />
        <button disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-full bg-cyanGlow px-5 py-3 text-sm font-bold text-ink transition hover:shadow-glow disabled:opacity-70">
          {loading ? "Sending..." : "Send signal"} <Send size={16} />
        </button>
      </motion.form>
    </Section>
  );
}
