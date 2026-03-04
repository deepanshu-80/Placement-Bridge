import { z } from 'zod';
import { insertJobSchema, insertUserSchema, jobs, applications, users } from './schema.ts';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    me: {
      method: 'GET' as const,
      path: '/api/users/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.internal,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    }
  },
  jobs: {
    list: {
      method: 'GET' as const,
      path: '/api/jobs' as const,
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/jobs/:id' as const,
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/jobs' as const,
      input: insertJobSchema,
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  applications: {
    list: {
      method: 'GET' as const,
      path: '/api/applications' as const,
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/applications' as const,
      input: z.object({ jobId: z.number() }),
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/applications/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  qa: {
    list: {
      method: 'GET' as const,
      path: '/api/qa' as const,
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    createQuestion: {
      method: 'POST' as const,
      path: '/api/qa/questions' as const,
      input: z.object({ content: z.string(), company: z.string().optional() }),
      responses: {
        201: z.custom<any>(),
      },
    },
    createAnswer: {
      method: 'POST' as const,
      path: '/api/qa/answers' as const,
      input: z.object({ questionId: z.number(), content: z.string() }),
      responses: {
        201: z.custom<any>(),
      },
    },
  },
  resources: {
    list: {
      method: 'GET' as const,
      path: '/api/resources' as const,
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/resources' as const,
      input: z.object({ title: z.string(), content: z.string(), type: z.string(), company: z.string().optional() }),
      responses: {
        201: z.custom<any>(),
      },
    },
  },
  admin: {
    listPendingVerifications: {
      method: 'GET' as const,
      path: '/api/admin/verifications' as const,
      responses: {
        200: z.array(z.custom<any>()),
      }
    },
    approveVerification: {
      method: 'POST' as const,
      path: '/api/admin/verifications/:id/approve' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
