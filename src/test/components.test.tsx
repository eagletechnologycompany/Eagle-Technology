import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EagleLogo } from "@/components/ui/EagleLogo";
import { ContactForm } from "@/components/contact/ContactForm";

describe("Eagle Technology UI components", () => {
  it("renders the official Eagle SVG logo with accessible label", () => {
    render(<EagleLogo />);
    expect(screen.getByRole("img", { name: "Eagle Technology logo" })).toBeInTheDocument();
  });

  it("renders the header with all primary links and Start a Project CTA", () => {
    render(<Header />);
    expect(screen.getByText("Eagle Technology")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solutions" })).toHaveAttribute(
      "href",
      "/solutions"
    );
    expect(screen.getByRole("link", { name: /Start a Project/i })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders footer with slogan and explicit email placeholder", () => {
    render(<Footer />);
    expect(screen.getByText("See Further. Build Smarter.")).toBeInTheDocument();
    expect(screen.getByText(/hello@eagle-technology\.placeholder/i)).toBeInTheDocument();
  });

  it("validates empty submission in ContactForm without network call", () => {
    render(<ContactForm initialService="web" />);
    const select = screen.getByLabelText(/Service of Interest/i) as HTMLSelectElement;
    expect(select.value).toBe("web");

    fireEvent.click(screen.getByRole("button", { name: /Submit Inquiry/i }));
    expect(
      screen.getByText(/Please correct the highlighted fields/i)
    ).toBeInTheDocument();
  });
});
