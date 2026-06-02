const securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Informe o token JWT no formato Bearer.',
  },
};

const parameters = {
  UuidPathId: {
    name: 'id',
    in: 'path',
    required: true,
    description: 'UUID do recurso.',
    schema: {
      type: 'string',
      format: 'uuid',
    },
  },
  AgendamentoDateQuery: {
    name: 'data',
    in: 'query',
    required: false,
    description: 'Filtra os agendamentos por data no formato YYYY-MM-DD.',
    schema: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      example: '2026-04-20',
    },
  },
  AgendamentoStatusQuery: {
    name: 'status',
    in: 'query',
    required: false,
    description: 'Filtra agendamentos por status.',
    schema: {
      type: 'string',
      enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'],
    },
  },
  AgendamentoClienteIdQuery: {
    name: 'clienteId',
    in: 'query',
    required: false,
    description: 'Filtra agendamentos por cliente.',
    schema: {
      type: 'string',
      format: 'uuid',
    },
  },
  AgendamentoServicoIdQuery: {
    name: 'servicoId',
    in: 'query',
    required: false,
    description: 'Filtra agendamentos por servico.',
    schema: {
      type: 'string',
      format: 'uuid',
    },
  },
  ProfissionaisQQuery: {
    name: 'q',
    in: 'query',
    required: false,
    description: 'Busca textual por nome ou profissao.',
    schema: {
      type: 'string',
      example: 'barbeiro',
    },
  },
  ProfissionaisCidadeQuery: {
    name: 'cidade',
    in: 'query',
    required: false,
    description: 'Filtra profissionais por cidade.',
    schema: {
      type: 'string',
      example: 'Cuiaba',
    },
  },
  ProfissionaisCategoriaQuery: {
    name: 'categoria',
    in: 'query',
    required: false,
    description: 'Filtra profissionais por categoria.',
    schema: {
      type: 'string',
      example: 'Beleza',
    },
  },
  ProfissionaisModalidadeQuery: {
    name: 'modalidade',
    in: 'query',
    required: false,
    description: 'Filtra profissionais por modalidade.',
    schema: {
      type: 'string',
      example: 'PRESENCIAL',
    },
  },
  ProfissionaisPrecoMaxQuery: {
    name: 'precoMax',
    in: 'query',
    required: false,
    description: 'Filtra profissionais por preco inicial maximo.',
    schema: {
      type: 'number',
      minimum: 0,
      example: 120,
    },
  },
  ProfissionaisAvaliacaoMinimaQuery: {
    name: 'avaliacaoMinima',
    in: 'query',
    required: false,
    description: 'Filtra profissionais por avaliacao minima.',
    schema: {
      type: 'number',
      minimum: 0,
      maximum: 5,
      example: 4.5,
    },
  },
  DisponibilidadeDataQuery: {
    name: 'data',
    in: 'query',
    required: true,
    description: 'Data de consulta da disponibilidade no formato YYYY-MM-DD.',
    schema: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      example: '2026-04-20',
    },
  },
};

const responses = {
  UnauthorizedError: {
    description: 'Token ausente ou invalido.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'Token de autenticacao invalido.',
        },
      },
    },
  },
  ForbiddenError: {
    description: 'Usuario sem permissao para esta operacao.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'Usuario sem permissao para esta operacao.',
        },
      },
    },
  },
  NotFoundError: {
    description: 'Recurso nao encontrado.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'Recurso nao encontrado.',
        },
      },
    },
  },
  ConflictError: {
    description: 'Conflito de negocio ou duplicidade.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'Ja existe um agendamento nesse horario.',
        },
      },
    },
  },
  ValidationError: {
    description: 'Falha de validacao no payload ou query params.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ValidationErrorResponse',
        },
      },
    },
  },
};

const schemas = {
  HealthResponse: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Booka Backend V2' },
      status: { type: 'string', example: 'ok' },
      docs: { type: 'string', example: '/docs' },
    },
    required: ['name', 'status', 'docs'],
  },
  SuccessResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
    },
    required: ['success'],
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Erro interno no servidor.',
      },
    },
    required: ['message'],
  },
  ValidationErrorResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Erro de validacao.',
      },
      issues: {
        type: 'object',
        properties: {
          formErrors: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          fieldErrors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    required: ['message', 'issues'],
  },
  AuthUser: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Profissional Booka' },
      email: { type: 'string', format: 'email', example: 'profissional@booka.local' },
      role: {
        type: 'string',
        enum: ['CLIENTE', 'PROFISSIONAL'],
      },
    },
    required: ['id', 'nome', 'email', 'role'],
  },
  LojaContext: {
    type: 'object',
    nullable: true,
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Studio Booka' },
      onboardingConcluido: { type: 'boolean', example: false },
    },
  },
  AuthResponse: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'jwt-token' },
      user: {
        $ref: '#/components/schemas/AuthUser',
      },
    },
    required: ['token', 'user'],
  },
  AuthMeResponse: {
    type: 'object',
    properties: {
      user: {
        $ref: '#/components/schemas/AuthUser',
      },
      loja: {
        $ref: '#/components/schemas/LojaContext',
      },
    },
    required: ['user', 'loja'],
  },
  AuthRegisterInput: {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Maria Oliveira' },
      email: { type: 'string', format: 'email', example: 'maria@booka.local' },
      password: { type: 'string', minLength: 8, example: '12345678' },
      role: {
        type: 'string',
        enum: ['CLIENTE', 'PROFISSIONAL'],
        example: 'CLIENTE',
      },
    },
    required: ['nome', 'email', 'password'],
  },
  AuthLoginInput: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', example: 'profissional@booka.local' },
      password: { type: 'string', example: '12345678' },
    },
    required: ['email', 'password'],
  },
  Loja: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Studio Booka' },
      email: { type: 'string', format: 'email', nullable: true },
      telefone: { type: 'string', nullable: true, example: '65999990000' },
      endereco: { type: 'string', nullable: true, example: 'Rua das Palmeiras, 123' },
      cidade: { type: 'string', nullable: true, example: 'Cuiaba' },
      descricao: { type: 'string', nullable: true, example: 'Atendimento profissional com hora marcada.' },
      imagemUrl: { type: 'string', format: 'uri', nullable: true },
      onboardingConcluido: { type: 'boolean', example: true },
      profissao: { type: 'string', nullable: true, example: 'Barbeiro' },
      categoriaPrincipal: { type: 'string', nullable: true, example: 'Beleza' },
      modalidadePrincipal: {
        type: 'string',
        nullable: true,
        enum: ['ONLINE', 'PRESENCIAL', 'HIBRIDO'],
      },
      tipoVendedor: {
        type: 'string',
        nullable: true,
        enum: ['AUTONOMO', 'EMPRESA'],
      },
    },
    required: [
      'id',
      'nome',
      'email',
      'telefone',
      'endereco',
      'cidade',
      'descricao',
      'imagemUrl',
      'onboardingConcluido',
      'profissao',
      'categoriaPrincipal',
      'modalidadePrincipal',
      'tipoVendedor',
    ],
  },
  LojaUpdateInput: {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Studio Booka' },
      email: { type: 'string', format: 'email', nullable: true, example: 'contato@booka.local' },
      telefone: { type: 'string', nullable: true, example: '65999990000' },
      endereco: { type: 'string', nullable: true, example: 'Rua das Palmeiras, 123' },
      cidade: { type: 'string', nullable: true, example: 'Cuiaba' },
      descricao: { type: 'string', nullable: true, example: 'Atendimento profissional com hora marcada.' },
      imagemUrl: { type: 'string', format: 'uri', nullable: true },
      profissao: { type: 'string', example: 'Barbeiro' },
      categoriaPrincipal: { type: 'string', example: 'Beleza' },
      modalidadePrincipal: {
        type: 'string',
        enum: ['ONLINE', 'PRESENCIAL', 'HIBRIDO'],
      },
      tipoVendedor: {
        type: 'string',
        enum: ['AUTONOMO', 'EMPRESA'],
      },
    },
  },
  OnboardingFinalizeInput: {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Studio Booka' },
      telefone: { type: 'string', example: '65999990000' },
      endereco: { type: 'string', example: 'Rua das Palmeiras, 123' },
      cidade: { type: 'string', example: 'Cuiaba' },
      descricao: { type: 'string', example: 'Atendimento profissional com hora marcada.' },
      profissao: { type: 'string', example: 'Barbeiro' },
      categoriaPrincipal: { type: 'string', example: 'Beleza' },
      modalidadePrincipal: {
        type: 'string',
        enum: ['ONLINE', 'PRESENCIAL', 'HIBRIDO'],
        example: 'PRESENCIAL',
      },
      tipoVendedor: {
        type: 'string',
        enum: ['AUTONOMO', 'EMPRESA'],
        example: 'AUTONOMO',
      },
    },
    required: ['nome', 'telefone', 'endereco', 'profissao', 'categoriaPrincipal'],
  },
  Servico: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Corte Masculino' },
      descricao: { type: 'string', nullable: true, example: 'Corte tradicional com acabamento.' },
      duracaoMinutos: { type: 'integer', example: 45 },
      preco: { type: 'number', example: 50 },
      ativo: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'nome', 'descricao', 'duracaoMinutos', 'preco', 'ativo', 'createdAt', 'updatedAt'],
  },
  ServicoCreateInput: {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Corte Masculino' },
      descricao: { type: 'string', nullable: true, example: 'Corte tradicional com acabamento.' },
      duracaoMinutos: { type: 'integer', minimum: 1, example: 45 },
      preco: { type: 'number', minimum: 0.01, example: 50 },
      ativo: { type: 'boolean', example: true },
    },
    required: ['nome', 'duracaoMinutos', 'preco'],
  },
  ServicoUpdateInput: {
    allOf: [
      {
        $ref: '#/components/schemas/ServicoCreateInput',
      },
    ],
  },
  Cliente: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Joao da Silva' },
      email: { type: 'string', format: 'email', nullable: true, example: 'joao@email.com' },
      telefone: { type: 'string', example: '65999991111' },
      anotacoes: { type: 'string', nullable: true, example: 'Cliente inicial do painel.' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'nome', 'email', 'telefone', 'anotacoes', 'createdAt', 'updatedAt'],
  },
  ClienteCreateInput: {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Joao da Silva' },
      email: { type: 'string', format: 'email', nullable: true, example: 'joao@email.com' },
      telefone: { type: 'string', example: '65999991111' },
      anotacoes: { type: 'string', nullable: true, example: 'Cliente VIP' },
      observacoes: { type: 'string', nullable: true, example: 'Campo aceito por compatibilidade' },
    },
    required: ['nome', 'telefone'],
  },
  ClienteUpdateInput: {
    allOf: [
      {
        $ref: '#/components/schemas/ClienteCreateInput',
      },
    ],
  },
  Agendamento: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      clienteId: { type: 'string', format: 'uuid' },
      clienteNome: { type: 'string', example: 'Cliente Seed' },
      servicoId: { type: 'string', format: 'uuid' },
      servicoNome: { type: 'string', example: 'Corte Masculino' },
      inicio: { type: 'string', format: 'date-time' },
      fim: { type: 'string', format: 'date-time' },
      status: {
        type: 'string',
        enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'],
      },
      observacoes: { type: 'string', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: [
      'id',
      'clienteId',
      'clienteNome',
      'servicoId',
      'servicoNome',
      'inicio',
      'fim',
      'status',
      'observacoes',
      'createdAt',
      'updatedAt',
    ],
  },
  AgendamentoCreateInput: {
    type: 'object',
    properties: {
      clienteId: { type: 'string', format: 'uuid' },
      servicoId: { type: 'string', format: 'uuid' },
      inicio: { type: 'string', format: 'date-time', example: '2026-04-20T14:00:00.000Z' },
      observacoes: { type: 'string', nullable: true, example: 'Encaixe' },
      status: {
        type: 'string',
        enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'],
        example: 'PENDENTE',
      },
    },
    required: ['clienteId', 'servicoId', 'inicio'],
  },
  AgendamentoUpdateInput: {
    allOf: [
      {
        $ref: '#/components/schemas/AgendamentoCreateInput',
      },
    ],
  },
  AgendamentoPublicoClienteInput: {
    type: 'object',
    properties: {
      nome: { type: 'string', example: 'Maria Oliveira' },
      email: { type: 'string', format: 'email', nullable: true, example: 'maria@email.com' },
      telefone: { type: 'string', example: '65999992222' },
    },
    required: ['nome', 'telefone'],
  },
  AgendamentoPublicoCreateInput: {
    type: 'object',
    properties: {
      lojaId: { type: 'string', format: 'uuid' },
      servicoId: { type: 'string', format: 'uuid' },
      inicio: { type: 'string', format: 'date-time', example: '2026-04-20T14:00:00.000Z' },
      observacoes: { type: 'string', nullable: true, example: 'Primeiro atendimento' },
      cliente: {
        $ref: '#/components/schemas/AgendamentoPublicoClienteInput',
      },
    },
    required: ['lojaId', 'servicoId', 'inicio', 'cliente'],
  },
  ProfissionalListItem: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Studio Booka' },
      profissao: { type: 'string', example: 'Barbeiro' },
      categoria: { type: 'string', example: 'Beleza' },
      modalidade: { type: 'string', example: 'PRESENCIAL' },
      vendedor: { type: 'string', example: 'AUTONOMO' },
      cidade: { type: 'string', nullable: true, example: 'Cuiaba' },
      avatarUrl: { type: 'string', nullable: true, example: '/uploads/avatars/avatar.webp' },
      capaUrl: { type: 'string', nullable: true, example: '/uploads/capas/capa.webp' },
      img: { type: 'string', format: 'uri', nullable: true },
      precoInicial: { type: 'number', example: 35 },
      rating: { type: 'number', example: 4.9 },
    },
    required: ['id', 'nome', 'profissao', 'categoria', 'modalidade', 'vendedor', 'cidade', 'avatarUrl', 'capaUrl', 'img', 'precoInicial', 'rating'],
  },
  ProfissionalServicoPublico: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Corte Masculino' },
      descricao: { type: 'string', nullable: true, example: 'Corte tradicional com acabamento.' },
      preco: { type: 'number', example: 50 },
      duracaoMinutos: { type: 'integer', example: 45 },
    },
    required: ['id', 'nome', 'descricao', 'preco', 'duracaoMinutos'],
  },
  ProfissionalDetalhe: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'Studio Booka' },
      profissao: { type: 'string', example: 'Barbeiro' },
      descricao: { type: 'string', nullable: true, example: 'Atendimento profissional com hora marcada.' },
      telefone: { type: 'string', nullable: true, example: '65999990000' },
      cidade: { type: 'string', nullable: true, example: 'Cuiaba' },
      avatarUrl: { type: 'string', nullable: true, example: '/uploads/avatars/avatar.webp' },
      capaUrl: { type: 'string', nullable: true, example: '/uploads/capas/capa.webp' },
      img: { type: 'string', format: 'uri', nullable: true },
      rating: { type: 'number', example: 4.9 },
      servicos: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ProfissionalServicoPublico',
        },
      },
    },
    required: ['id', 'nome', 'profissao', 'descricao', 'telefone', 'cidade', 'avatarUrl', 'capaUrl', 'img', 'rating', 'servicos'],
  },
  DisponibilidadeResponse: {
    type: 'object',
    properties: {
      data: { type: 'string', example: '2026-04-20' },
      horarios: {
        type: 'array',
        items: {
          type: 'string',
          example: '09:00',
        },
      },
    },
    required: ['data', 'horarios'],
  },
  BloqueioAgenda: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      inicio: { type: 'string', format: 'date-time' },
      fim: { type: 'string', format: 'date-time' },
      motivo: { type: 'string', nullable: true, example: 'Almoco' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'inicio', 'fim', 'motivo', 'createdAt', 'updatedAt'],
  },
  BloqueioAgendaInput: {
    type: 'object',
    properties: {
      inicio: { type: 'string', format: 'date-time', example: '2026-04-20T12:00:00.000Z' },
      fim: { type: 'string', format: 'date-time', example: '2026-04-20T13:00:00.000Z' },
      motivo: { type: 'string', nullable: true, example: 'Almoco' },
    },
    required: ['inicio', 'fim'],
  },
  BloqueioAgendaLoteInput: {
    type: 'object',
    properties: {
      bloqueios: {
        type: 'array',
        minItems: 1,
        maxItems: 60,
        items: {
          $ref: '#/components/schemas/BloqueioAgendaInput',
        },
      },
    },
    required: ['bloqueios'],
  },
  BloqueioAgendaUpdateInput: {
    type: 'object',
    properties: {
      inicio: { type: 'string', format: 'date-time', example: '2026-04-20T12:00:00.000Z' },
      fim: { type: 'string', format: 'date-time', example: '2026-04-20T13:00:00.000Z' },
      motivo: { type: 'string', nullable: true, example: 'Almoco' },
    },
  },
  DashboardProximoAgendamento: {
    type: 'object',
    nullable: true,
    properties: {
      id: { type: 'string', format: 'uuid' },
      inicio: { type: 'string', format: 'date-time' },
      clienteNome: { type: 'string', example: 'Cliente Seed' },
      servicoNome: { type: 'string', example: 'Corte Masculino' },
      status: {
        type: 'string',
        enum: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO'],
      },
    },
  },
  DashboardResumo: {
    type: 'object',
    properties: {
      loja: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string', example: 'Studio Booka' },
        },
        required: ['id', 'nome'],
      },
      metricas: {
        type: 'object',
        properties: {
          clientes: { type: 'integer', example: 10 },
          servicosAtivos: { type: 'integer', example: 4 },
          agendamentosHoje: { type: 'integer', example: 3 },
        },
        required: ['clientes', 'servicosAtivos', 'agendamentosHoje'],
      },
      proximoAgendamento: {
        $ref: '#/components/schemas/DashboardProximoAgendamento',
      },
    },
    required: ['loja', 'metricas', 'proximoAgendamento'],
  },
};

const paths = {
  '/health': {
    get: {
      tags: ['App'],
      summary: 'Healthcheck da API',
      responses: {
        200: {
          description: 'API online',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthResponse',
              },
            },
          },
        },
      },
    },
  },
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Cadastro de usuario',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AuthRegisterInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Usuario criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        409: {
          $ref: '#/components/responses/ConflictError',
        },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AuthLoginInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login realizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
      },
    },
  },
  '/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Usuario autenticado',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Dados do usuario autenticado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthMeResponse',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/loja': {
    get: {
      tags: ['Loja'],
      summary: 'Busca a loja do profissional',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Dados da loja do profissional autenticado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Loja',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    put: {
      tags: ['Loja'],
      summary: 'Atualiza a loja e o perfil publico',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LojaUpdateInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Loja atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Loja',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/onboarding/finalizar': {
    post: {
      tags: ['Onboarding'],
      summary: 'Finaliza onboarding da loja',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/OnboardingFinalizeInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Onboarding finalizado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/servicos': {
    get: {
      tags: ['Servicos'],
      summary: 'Lista servicos da loja autenticada',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de servicos da loja',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Servico',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    post: {
      tags: ['Servicos'],
      summary: 'Cria um novo servico',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ServicoCreateInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Servico criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Servico',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/servicos/{id}': {
    put: {
      tags: ['Servicos'],
      summary: 'Atualiza um servico',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ServicoUpdateInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Servico atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Servico',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    delete: {
      tags: ['Servicos'],
      summary: 'Remove um servico',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      responses: {
        200: {
          description: 'Servico removido com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/clientes': {
    get: {
      tags: ['Clientes'],
      summary: 'Lista clientes da loja autenticada',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de clientes da loja',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Cliente',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    post: {
      tags: ['Clientes'],
      summary: 'Cria um novo cliente',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ClienteCreateInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Cliente criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Cliente',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/clientes/{id}': {
    get: {
      tags: ['Clientes'],
      summary: 'Busca um cliente por id',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      responses: {
        200: {
          description: 'Cliente encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Cliente',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    put: {
      tags: ['Clientes'],
      summary: 'Atualiza um cliente',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ClienteUpdateInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Cliente atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Cliente',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    delete: {
      tags: ['Clientes'],
      summary: 'Remove um cliente',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      responses: {
        200: {
          description: 'Cliente removido com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/agendamentos': {
    get: {
      tags: ['Agendamentos'],
      summary: 'Lista agendamentos da loja autenticada',
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/AgendamentoDateQuery' },
        { $ref: '#/components/parameters/AgendamentoStatusQuery' },
        { $ref: '#/components/parameters/AgendamentoClienteIdQuery' },
        { $ref: '#/components/parameters/AgendamentoServicoIdQuery' },
      ],
      responses: {
        200: {
          description: 'Lista de agendamentos',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Agendamento',
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    post: {
      tags: ['Agendamentos'],
      summary: 'Cria um agendamento pelo painel',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AgendamentoCreateInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Agendamento criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Agendamento',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        409: {
          $ref: '#/components/responses/ConflictError',
        },
      },
    },
  },
  '/agendamentos/{id}': {
    put: {
      tags: ['Agendamentos'],
      summary: 'Atualiza um agendamento',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AgendamentoUpdateInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Agendamento atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Agendamento',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        409: {
          $ref: '#/components/responses/ConflictError',
        },
      },
    },
    delete: {
      tags: ['Agendamentos'],
      summary: 'Remove um agendamento',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      responses: {
        200: {
          description: 'Agendamento removido com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/agendamentos/publicos': {
    post: {
      tags: ['Agendamentos'],
      summary: 'Cria um agendamento publico a partir do marketplace',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AgendamentoPublicoCreateInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Agendamento publico criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Agendamento',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
        409: {
          $ref: '#/components/responses/ConflictError',
        },
      },
    },
  },
  '/profissionais': {
    get: {
      tags: ['Profissionais'],
      summary: 'Lista profissionais publicados no marketplace',
      parameters: [
        { $ref: '#/components/parameters/ProfissionaisQQuery' },
        { $ref: '#/components/parameters/ProfissionaisCidadeQuery' },
        { $ref: '#/components/parameters/ProfissionaisCategoriaQuery' },
        { $ref: '#/components/parameters/ProfissionaisModalidadeQuery' },
        { $ref: '#/components/parameters/ProfissionaisPrecoMaxQuery' },
        { $ref: '#/components/parameters/ProfissionaisAvaliacaoMinimaQuery' },
      ],
      responses: {
        200: {
          description: 'Lista publica de profissionais',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ProfissionalListItem',
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
      },
    },
  },
  '/profissionais/{id}': {
    get: {
      tags: ['Profissionais'],
      summary: 'Busca o detalhe publico de um profissional',
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      responses: {
        200: {
          description: 'Detalhe publico do profissional',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProfissionalDetalhe',
              },
            },
          },
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/profissionais/{id}/disponibilidade': {
    get: {
      tags: ['Profissionais'],
      summary: 'Lista horarios disponiveis para um profissional em uma data',
      parameters: [
        { $ref: '#/components/parameters/UuidPathId' },
        { $ref: '#/components/parameters/DisponibilidadeDataQuery' },
      ],
      responses: {
        200: {
          description: 'Horarios disponiveis para a data informada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DisponibilidadeResponse',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/bloqueios': {
    get: {
      tags: ['Bloqueios'],
      summary: 'Lista bloqueios da agenda da loja autenticada',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de bloqueios',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/BloqueioAgenda',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
      },
    },
    post: {
      tags: ['Bloqueios'],
      summary: 'Cria um bloqueio de agenda',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BloqueioAgendaInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Bloqueio criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BloqueioAgenda',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
      },
    },
  },
  '/bloqueios/lote': {
    post: {
      tags: ['Bloqueios'],
      summary: 'Cria bloqueios de agenda em lote',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BloqueioAgendaLoteInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Bloqueios criados com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/BloqueioAgenda',
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
      },
    },
  },
  '/bloqueios/{id}': {
    get: {
      tags: ['Bloqueios'],
      summary: 'Busca um bloqueio por id',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      responses: {
        200: {
          description: 'Bloqueio encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BloqueioAgenda',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    put: {
      tags: ['Bloqueios'],
      summary: 'Atualiza um bloqueio',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BloqueioAgendaUpdateInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Bloqueio atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BloqueioAgenda',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/ValidationError',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
    delete: {
      tags: ['Bloqueios'],
      summary: 'Remove um bloqueio',
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UuidPathId' }],
      responses: {
        200: {
          description: 'Bloqueio removido com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
  '/dashboard/resumo': {
    get: {
      tags: ['Dashboard'],
      summary: 'Resumo do dashboard profissional',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Resumo consolidado do dashboard',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DashboardResumo',
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          $ref: '#/components/responses/ForbiddenError',
        },
        404: {
          $ref: '#/components/responses/NotFoundError',
        },
      },
    },
  },
};

export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Booka Backend V2',
    version: '0.1.0',
    description:
      'API reconstruida a partir do frontend atual do Booka, com rotas publicas de marketplace e rotas privadas do painel profissional.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
    },
  ],
  tags: [
    { name: 'App' },
    { name: 'Auth' },
    { name: 'Onboarding' },
    { name: 'Loja' },
    { name: 'Servicos' },
    { name: 'Clientes' },
    { name: 'Agendamentos' },
    { name: 'Profissionais' },
    { name: 'Bloqueios' },
    { name: 'Dashboard' },
  ],
  components: {
    securitySchemes,
    parameters,
    responses,
    schemas,
  },
  paths,
} as const;
