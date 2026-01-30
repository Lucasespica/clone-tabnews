import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: "Lucas <lucas@example.com>",
      to: "<contato@example.com>",
      subject: "Test de assunto",
      text: "Test de corpo.",
    });

    await email.send({
      from: "Lucas <lucas@example.com>",
      to: "<contato@example.com>",
      subject: "Último email enviado",
      text: "Corpo do último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<lucas@example.com>");
    expect(lastEmail.recipients[0]).toBe("<contato@example.com>");
    expect(lastEmail.subject).toBe("Último email enviado");
    expect(lastEmail.text).toBe("Corpo do último email.\r\n");
  });
});
