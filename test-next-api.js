const { POST } = require('./.next/server/app/api/checkout/route.js');

async function runTests() {
  console.log("=== COMEÇANDO TESTES DO CHECKOUT ===");

  async function mockRequest(body) {
    return {
      json: async () => body,
      url: 'http://localhost:3000/api/checkout'
    };
  }

  // Helper para interpretar a resposta do Next
  async function parseResponse(res) {
    // res is a NextResponse which extends Response
    const status = res.status;
    let data;
    try {
        data = await res.json();
    } catch(e) {
        data = await res.text();
    }
    return { status, data };
  }

  // 1. Invalid planId
  console.log("\nTeste 1: planId inválido");
  try {
    const req1 = await mockRequest({ planId: "hacker_plan", email: "test@example.com" });
    const res1 = await POST(req1);
    const parsed1 = await parseResponse(res1);
    console.log("Status recebido:", parsed1.status);
    console.log("Corpo recebido:", JSON.stringify(parsed1.data));
  } catch (err) {
    console.error("Erro no Teste 1:", err.message);
  }

  // 2. Invalid email
  console.log("\nTeste 2: Email inválido");
  try {
    const req2 = await mockRequest({ planId: "starter", email: "not_an_email" });
    const res2 = await POST(req2);
    const parsed2 = await parseResponse(res2);
    console.log("Status recebido:", parsed2.status);
    console.log("Corpo recebido:", JSON.stringify(parsed2.data));
  } catch (err) {
    console.error("Erro no Teste 2:", err.message);
  }

  // 3. Price Validation (Starter)
  console.log("\nTeste 3: Preço do Plano Starter");
  try {
    const req3 = await mockRequest({ planId: "starter", email: "valido@example.com" });
    const res3 = await POST(req3);
    const parsed3 = await parseResponse(res3);
    console.log("Status recebido:", parsed3.status);
    console.log("Corpo recebido:", JSON.stringify(parsed3.data));
    if (parsed3.data && parsed3.data.pixCode) {
      // Procurando 5405159.00 no pixCode
      const hasPrice = parsed3.data.pixCode.includes("5406159.00") || parsed3.data.pixCode.includes("5405159.00");
      console.log("Contém 159.00? ", hasPrice ? "SIM" : "NÃO");
    }
  } catch (err) {
      console.error("Erro no Teste 3:", err.message);
  }

  // 4. Price Validation (Pro)
  console.log("\nTeste 4: Preço do Plano Pro");
  try {
    const req4 = await mockRequest({ planId: "pro", email: "valido@example.com" });
    const res4 = await POST(req4);
    const parsed4 = await parseResponse(res4);
    console.log("Status recebido:", parsed4.status);
    console.log("Corpo recebido:", JSON.stringify(parsed4.data));
    if (parsed4.data && parsed4.data.pixCode) {
       // O preço no payload do pix mockup
       const hasPrice = parsed4.data.pixCode.includes("5406289.00") || parsed4.data.pixCode.includes("5405289.00");
       console.log("Contém 289.00? ", hasPrice ? "SIM" : "NÃO");
    }
  } catch (err) {
      console.error("Erro no Teste 4:", err.message);
  }
}

runTests();
