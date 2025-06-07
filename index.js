app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('🟢 Dados recebidos do Kommo:', JSON.stringify(data, null, 2));

  if (!data.lead) {
    console.warn("❌ Objeto 'lead' não encontrado nos dados recebidos:", JSON.stringify(data, null, 2));
    return res.status(400).send("Objeto 'lead' ausente.");
  }

  const status = data.lead.status?.name;

  if (status && status.toLowerCase() === 'demanda identificada') {
    const leadName = data.lead.name || 'Lead sem nome';
    const phone = data.lead.custom_fields_values?.find(f => f.field_name === 'Telefone')?.values?.[0]?.value || 'Sem telefone';
    const email = data.lead.custom_fields_values?.find(f => f.field_name === 'Email')?.values?.[0]?.value || 'Sem email';

    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
        {
          name: `Atender lead: ${leadName}`,
          description: `Telefone: ${phone}\nEmail: ${email}`,
          status: 'Open'
        },
        {
          headers: {
            Authorization: CLICKUP_API_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Tarefa criada no ClickUp:', response.data);
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

/*require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Variáveis de ambiente
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

// Teste do servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando ✅');
});

// Endpoint do webhook
app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('🟢 Dados recebidos do Kommo:', JSON.stringify(data, null, 2));

  const status = data.lead?.status?.name;

  if (status && status.toLowerCase() === 'demanda identificada') {
    const leadName = data.lead?.name || 'Lead sem nome';
    const phone = data.lead?.custom_fields_values?.find(f => f.field_name === 'Telefone')?.values?.[0]?.value || 'Sem telefone';
    const email = data.lead?.custom_fields_values?.find(f => f.field_name === 'Email')?.values?.[0]?.value || 'Sem email';

    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
        {
          name: `Atender lead: ${leadName}`,
          description: `Telefone: ${phone}\nEmail: ${email}`,
          status: 'Open' // Ajuste para o status correto da sua lista, se necessário
        },
        {
          headers: {
            Authorization: CLICKUP_API_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Tarefa criada no ClickUp:', response.data);
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

// Use a porta do Railway ou 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
*/
/*require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Variáveis de ambiente
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

// Teste do servidor
app.get('/', (req, res) => {
  res.send('Servidor funcionando ✅');
});

// Endpoint do webhook
app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('🟢 Dados recebidos do Kommo:', JSON.stringify(data, null, 2));

  const status = data.lead?.status?.name;

  if (status && status.toLowerCase() === 'demanda identificada') {
    const leadName = data.lead?.name || 'Lead sem nome';
    const phone = data.lead?.custom_fields_values?.find(f => f.field_name === 'Telefone')?.values?.[0]?.value || 'Sem telefone';
    const email = data.lead?.custom_fields_values?.find(f => f.field_name === 'Email')?.values?.[0]?.value || 'Sem email';

    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
        {
          name: `Atender lead: ${leadName}`,
          description: `Telefone: ${phone}\nEmail: ${email}`,
          status: 'Open' // Ajuste para o status correto da sua lista, se necessário
        },
        {
          headers: {
            Authorization: CLICKUP_API_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Tarefa criada no ClickUp:', response.data);
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

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

*/