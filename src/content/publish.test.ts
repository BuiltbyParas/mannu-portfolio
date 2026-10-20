import assert from "node:assert/strict";
import { test } from "node:test";

import {
  contactActions,
  instagramHref,
  publishCertificates,
  publishExperience,
  publishProjects,
  safeExternalUrl,
  safeLocalImage,
  whatsappHref,
} from "./publish.ts";
import { certificates, contact, experience, projects } from "./site.ts";

test("the shipped content publishes nothing that has not been filled in", () => {
  const certs = publishCertificates(certificates);
  assert.equal(certs.featured.length + certs.more.length, 0);
  assert.deepEqual(publishExperience(experience), []);
  assert.deepEqual(publishProjects(projects), []);
  assert.deepEqual(contactActions(contact), []);
});

test("external links must be https", () => {
  assert.equal(safeExternalUrl(""), null);
  assert.equal(safeExternalUrl("   "), null);
  assert.equal(safeExternalUrl("http://example.org"), null);
  assert.equal(safeExternalUrl("javascript:alert(1)"), null);
  assert.equal(safeExternalUrl("not a url"), null);
  assert.equal(safeExternalUrl("https://example.org/a"), "https://example.org/a");
});

test("certificate images must be local files in /public", () => {
  assert.equal(safeLocalImage("/certificates/c.jpg"), "/certificates/c.jpg");
  assert.equal(safeLocalImage("//evil.example/c.jpg"), null);
  assert.equal(safeLocalImage("/../secret.png"), null);
  assert.equal(safeLocalImage("https://example.org/c.jpg"), null);
  assert.equal(safeLocalImage("/certificates/c.pdf"), null);
});

test("contact actions only appear for valid WhatsApp and Instagram links", () => {
  assert.equal(whatsappHref("https://wa.me/"), null);
  assert.equal(whatsappHref("https://wa.me/12345678901"), "https://wa.me/12345678901");
  assert.equal(whatsappHref("https://example.org/12345678901"), null);
  assert.equal(instagramHref("https://www.instagram.com/"), null);
  assert.equal(instagramHref("https://www.instagram.com/some.name/"), "https://www.instagram.com/some.name/");
  assert.equal(instagramHref("https://www.instagram.com/p/abc/"), null);

  const onlyInstagram = contactActions({
    whatsappUrl: "",
    instagramUrl: "https://instagram.com/some_name",
  });
  assert.deepEqual(
    onlyInstagram.map((a) => a.id),
    ["instagram"],
  );
});

test("certificates need a title and an issuer, and featured ones come first", () => {
  const result = publishCertificates([
    { title: "A", issuer: "" },
    { title: "B", issuer: "Org", url: "https://example.org/verify" },
    { title: "C", issuer: "Org", featured: true, image: "/certificates/c.webp" },
    { title: "D", issuer: "Org" },
    { title: "E", issuer: "Org" },
    { title: "F", issuer: "Org" },
  ]);
  assert.deepEqual(
    result.featured.map((c) => c.title),
    ["C", "B", "D", "E"],
  );
  assert.deepEqual(
    result.more.map((c) => c.title),
    ["F"],
  );
  assert.equal(result.featured[0].href, "/certificates/c.webp");
  assert.equal(result.featured[1].href, "https://example.org/verify");
  assert.equal(result.featured[2].href, null);
});

test("experience needs a role and an organisation; periods are never invented", () => {
  const result = publishExperience([
    { role: "", organization: "Somewhere" },
    { role: "Assistant", organization: "Org", start: "June 2026" },
    { role: "Volunteer", organization: "Org", start: "2025", end: "2026" },
  ]);
  assert.equal(result.length, 2);
  assert.equal(result[0].period, "June 2026");
  assert.equal(result[1].period, "2025 - 2026");
});
