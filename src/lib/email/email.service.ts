import { Resend } from 'resend';
import { env } from '../../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export type EmailSolicitacaoParams = {
  clienteEmail: string;
  clienteNome: string;
  lojaNome: string;
  servicoNome: string;
  inicio: Date;
};

export type EmailConfirmacaoParams = {
  clienteEmail: string;
  clienteNome: string;
  lojaNome: string;
  servicoNome: string;
  inicio: Date;
  fim: Date;
  lojaEndereco: string | null;
  lojaLogradouro: string | null;
  lojaNumero: string | null;
  lojaBairro: string | null;
  lojaCidade: string | null;
  lojaEstado: string | null;
  lojaTelefone: string | null;
};

function formatarData(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
}

function formatarHora(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

function montarEndereco(params: Pick<EmailConfirmacaoParams, 'lojaEndereco' | 'lojaLogradouro' | 'lojaNumero' | 'lojaBairro' | 'lojaCidade' | 'lojaEstado'>): string {
  if (params.lojaLogradouro) {
    const partes = [
      params.lojaLogradouro,
      params.lojaNumero,
      params.lojaBairro,
      params.lojaCidade && params.lojaEstado
        ? `${params.lojaCidade}/${params.lojaEstado}`
        : params.lojaCidade || params.lojaEstado,
    ].filter(Boolean);
    return partes.join(', ');
  }
  return params.lojaEndereco || 'A confirmar';
}

function templateBase(conteudo: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booka</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#4f46e5;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 16px;display:inline-block;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Booka</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
              ${conteudo}
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;"/>
              <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                Você está recebendo este e-mail pois realizou um agendamento via Booka.<br/>
                Em caso de dúvidas, entre em contato diretamente com o estabelecimento.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function templateSolicitacao(p: EmailSolicitacaoParams): string {
  const conteudo = `
    <h1 style="color:#1e293b;font-size:22px;font-weight:800;margin:0 0 8px;">Solicitação recebida! 🎉</h1>
    <p style="color:#64748b;font-size:15px;margin:0 0 28px;">Olá, <strong style="color:#1e293b;">${p.clienteNome}</strong>! Sua solicitação de agendamento foi recebida e está aguardando confirmação do estabelecimento.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:24px;">
          <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Detalhes da solicitação</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                <span style="color:#64748b;font-size:13px;">Estabelecimento</span>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${p.lojaNome}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                <span style="color:#64748b;font-size:13px;">Serviço</span>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${p.servicoNome}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                <span style="color:#64748b;font-size:13px;">Data</span>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${formatarData(p.inicio)}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <span style="color:#64748b;font-size:13px;">Horário solicitado</span>
              </td>
              <td style="padding:8px 0;text-align:right;">
                <strong style="color:#4f46e5;font-size:13px;">${formatarHora(p.inicio)}</strong>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9c3;border:1px solid #fde047;border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="color:#713f12;font-size:13px;margin:0;">
            ⏳ <strong>Aguardando confirmação.</strong> Você receberá outro e-mail assim que o estabelecimento confirmar seu horário.
          </p>
        </td>
      </tr>
    </table>
  `;
  return templateBase(conteudo);
}

function templateConfirmacao(p: EmailConfirmacaoParams): string {
  const endereco = montarEndereco(p);
  const conteudo = `
    <h1 style="color:#1e293b;font-size:22px;font-weight:800;margin:0 0 8px;">Agendamento confirmado! ✅</h1>
    <p style="color:#64748b;font-size:15px;margin:0 0 28px;">Olá, <strong style="color:#1e293b;">${p.clienteNome}</strong>! Seu agendamento foi confirmado. Veja abaixo todos os detalhes.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:24px;">
          <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Detalhes do agendamento</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                <span style="color:#64748b;font-size:13px;">Estabelecimento</span>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${p.lojaNome}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                <span style="color:#64748b;font-size:13px;">Serviço</span>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${p.servicoNome}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                <span style="color:#64748b;font-size:13px;">Data</span>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${formatarData(p.inicio)}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
                <span style="color:#64748b;font-size:13px;">Horário</span>
              </td>
              <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                <strong style="color:#4f46e5;font-size:15px;">${formatarHora(p.inicio)} — ${formatarHora(p.fim)}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <span style="color:#64748b;font-size:13px;">Endereço</span>
              </td>
              <td style="padding:8px 0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${endereco}</strong>
              </td>
            </tr>
            ${p.lojaTelefone ? `
            <tr>
              <td style="padding:8px 0;" colspan="2">
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"/>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <span style="color:#64748b;font-size:13px;">WhatsApp</span>
              </td>
              <td style="padding:8px 0;text-align:right;">
                <strong style="color:#1e293b;font-size:13px;">${p.lojaTelefone}</strong>
              </td>
            </tr>` : ''}
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="color:#14532d;font-size:13px;margin:0;">
            ✅ <strong>Tudo certo!</strong> Lembre-se de chegar com alguns minutos de antecedência.
          </p>
        </td>
      </tr>
    </table>
  `;
  return templateBase(conteudo);
}

export async function enviarEmailSolicitacao(params: EmailSolicitacaoParams): Promise<void> {
  if (env.RESEND_API_KEY === 're_placeholder' || env.RESEND_API_KEY.startsWith('re_COLOQUE')) {
    console.log('[email] RESEND_API_KEY não configurada — e-mail de solicitação não enviado para:', params.clienteEmail);
    return;
  }

  try {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: params.clienteEmail,
      subject: `Solicitação recebida — ${params.servicoNome} em ${params.lojaNome}`,
      html: templateSolicitacao(params),
    });
  } catch (err) {
    console.error('[email] Falha ao enviar e-mail de solicitação:', err);
  }
}

export async function enviarEmailConfirmacao(params: EmailConfirmacaoParams): Promise<void> {
  if (env.RESEND_API_KEY === 're_placeholder' || env.RESEND_API_KEY.startsWith('re_COLOQUE')) {
    console.log('[email] RESEND_API_KEY não configurada — e-mail de confirmação não enviado para:', params.clienteEmail);
    return;
  }

  try {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: params.clienteEmail,
      subject: `Agendamento confirmado — ${params.servicoNome} em ${params.lojaNome}`,
      html: templateConfirmacao(params),
    });
  } catch (err) {
    console.error('[email] Falha ao enviar e-mail de confirmação:', err);
  }
}
