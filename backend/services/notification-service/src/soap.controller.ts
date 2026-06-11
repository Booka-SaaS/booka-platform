import { Body, Controller, Get, Header, Post, Res } from '@nestjs/common';
import { verifyBearerToken } from './auth';
import { NotificationsService } from './notifications.service';

const SOAP_NS = 'http://booka.local/notifications';

export function extractTokenFromSoapEnvelope(body: string) {
  const match = body.match(/<(?:\w+:)?token>([\s\S]*?)<\/(?:\w+:)?token>/i);
  return match ? decodeXml(match[1].trim()) : null;
}

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function escapeXml(value: string | number) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function soapEnvelope(body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
${body}
  </soap:Body>
</soap:Envelope>`;
}

function soapFault(message: string) {
  return soapEnvelope(`    <soap:Fault>
      <faultcode>soap:Client</faultcode>
      <faultstring>${escapeXml(message)}</faultstring>
    </soap:Fault>`);
}

function wsdlXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<definitions name="NotificationSummaryService"
  targetNamespace="${SOAP_NS}"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:tns="${SOAP_NS}"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <types>
    <xsd:schema targetNamespace="${SOAP_NS}">
      <xsd:element name="GetNotificationSummaryRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="token" type="xsd:string" />
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="GetNotificationSummaryResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="total" type="xsd:int" />
            <xsd:element name="unread" type="xsd:int" />
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>
  <message name="GetNotificationSummaryInput">
    <part name="parameters" element="tns:GetNotificationSummaryRequest" />
  </message>
  <message name="GetNotificationSummaryOutput">
    <part name="parameters" element="tns:GetNotificationSummaryResponse" />
  </message>
  <portType name="NotificationSummaryPortType">
    <operation name="GetNotificationSummary">
      <input message="tns:GetNotificationSummaryInput" />
      <output message="tns:GetNotificationSummaryOutput" />
    </operation>
  </portType>
  <binding name="NotificationSummaryBinding" type="tns:NotificationSummaryPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http" />
    <operation name="GetNotificationSummary">
      <soap:operation soapAction="GetNotificationSummary" />
      <input><soap:body use="literal" /></input>
      <output><soap:body use="literal" /></output>
    </operation>
  </binding>
  <service name="NotificationSummaryService">
    <port name="NotificationSummaryPort" binding="tns:NotificationSummaryBinding">
      <soap:address location="http://localhost:3000/soap/notifications" />
    </port>
  </service>
</definitions>`;
}

@Controller('soap/notifications')
export class SoapController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @Header('Content-Type', 'text/xml; charset=utf-8')
  wsdl() {
    return wsdlXml();
  }

  @Post()
  @Header('Content-Type', 'text/xml; charset=utf-8')
  async summary(@Body() body: string, @Res({ passthrough: true }) response: any) {
    const token = extractTokenFromSoapEnvelope(body ?? '');

    if (!token) {
      response.status(400);
      return soapFault('Campo token ausente.');
    }

    try {
      const auth = verifyBearerToken(token);
      const summary = await this.notifications.summary(auth.userId);

      return soapEnvelope(`    <GetNotificationSummaryResponse xmlns="${SOAP_NS}">
      <total>${escapeXml(summary.total)}</total>
      <unread>${escapeXml(summary.unread)}</unread>
    </GetNotificationSummaryResponse>`);
    } catch {
      response.status(401);
      return soapFault('Token invalido.');
    }
  }
}
