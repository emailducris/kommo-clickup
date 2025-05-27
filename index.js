const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 🔐 Dados da API do ClickUp (pegando das variáveis do Railway)
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

// 🚀 Teste se o servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor funcionando! ✅');
});

// 🚀 Endpoint para receber webhook do Kommo
app.post('/webhook', async (req, res) => {
  const data = req.body;

  console.log('🟢 Dados recebidos do Kommo:', JSON.stringify(data, null, 2));

  const status = data.lead?.status?.name;

  if (status === 'Demanda Identificada') {
    const leadName = data.lead.name || 'Lead sem nome';
    const phone = data.lead.custom_fields_values?.find(f => f.field_name === 'Telefone')?.values[0]?.value || 'Sem telefone';
    const email = data.lead.custom_fields_values?.find(f => f.field_name === 'Email')?.values[0]?.value || 'Sem email';

    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
        {
          name: `Atender lead: ${leadName}`,
          description: `Telefone: ${phone}\nEmail: ${email}`,
          status: 'Open'  // Verifique se este status existe na sua lista do ClickUp
        },
        {
          headers: {
            Authorization: `Bearer ${CLICKUP_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📦 Resposta da API do ClickUp:', JSON.stringify(response.data, null, 2));
      console.log('✅ Tarefa criada no ClickUp!');
      res.status(200).send('Tarefa criada no ClickUp');
    } catch (error) {
      console.error('❌ Erro ao criar tarefa no ClickUp:', error.response?.data || error.message);
      res.status(500).send('Erro ao criar tarefa no ClickUp');
    }
  } else {
    console.log('ℹ️ Status não é "Demanda Identificada". Nenhuma tarefa criada.');
    res.status(200).send('Status não é Demanda Identificada');
  }
});

// 🚀 Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} 🚀`);
});

