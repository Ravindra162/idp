import * as z from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(10, {
      message: "Enter valid email or number",
    })
    .toLowerCase(),
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  browserUrl: z.string().optional(),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(4, {
        message: "Minimum of 4 characters required",
      })
      .toLowerCase(),
    email: z
      .string()
      .email({
        message: "Email is required",
      })
      .toLowerCase(),
    number: z
      .string()
      .min(10, {
        message: "Phone number must be 10 characters",
      })
      .max(10, {
        message: "Phone number must be 10 characters",
      }),
    password: z.string({ required_error: "Password is required" }).min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    domainUrl: z.string().optional(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const EditUserSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(4, {
      message: "Minimum of 4 characters required",
    })
    .toLowerCase()
    .optional(),
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .toLowerCase()
    .optional(),
  paymentType: z.string().toUpperCase().optional(),
  number: z
    .string()
    .min(10, {
      message: "Phone number must be 10 characters",
    })
    .max(10, {
      message: "Phone number must be 10 characters",
    })
    .optional(),
});

export const updateMoneySchema = z.object({
  userId: z.string(),
  amount: z.coerce.number().optional(),
});

export const UpdatePasswordSchema = z
  .object({
    id: z.string(),
    password: z.string({ required_error: "Password is required" }).min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

    const errors = [];

    if (!containsLowercase(password)) {
      errors.push(`Password must contain at least one lowercase letter.`);
    }

    if (!containsUppercase(password)) {
      errors.push(`Password must contain at least one uppercase letter.`);
    }

    if (!containsSpecialChar(password)) {
      errors.push(`Password must contain at least one special character.`);
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.\n");
    }

    if (errors.length > 0) {
      checkPassComplexity.addIssue({
        code: "custom",
        path: ["password"],
        message: errors.join("\n"),
      });
    }
  });
export const MoneySchema = z.object({
  amount: z.coerce.number().min(1, {
    message: "Amount must be greater than 0",
  }),
  upiid: z.string(),
  accountNumber: z.string(),
  transactionId: z
    .string()
    .min(1, {
      message: "Transaction Id is required",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Transaction Id cannot contain space characters",
    }),
  ifsccode: z.string().min(1, {
    message: "IFSC code is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  accountType: z.string().min(1, {
    message: "Account Type is required",
  }),
  bankName: z.string().min(1, {
    message: "Bank Name is required",
  }),
  upiinumber: z.string().min(1, {
    message: "UPI Number is required",
  }),
  image: z
    .custom<FileList>()
    .transform((val) => {
      if (val instanceof File) return val;
      if (val instanceof FileList) return val[0];
      return null;
    })
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: "Not a file",
        });

        return z.NEVER;
      }

      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size allowed is 5MB",
        });
      }

      if (
        !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
          file.type
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be an image (jpeg, jpg, png, webp)",
        });
      }
    })
    .pipe(z.custom<File>()),
});

export const PaymentSchema = z.object({
  amount: z.coerce.number().min(1, {
    message: "Amount must be greater than 0",
  }),
});

export const UpiFormSchema = z.object({
  upiId: z.string().min(1, "UPI ID is required"),
});

export const WithdrawMoneySchema = z.object({
  accountNumber: z
    .string()
    .nonempty("Account Number is required")
    .min(8, "Account Number must be at least 8 characters"),
  ifscCode: z
    .string()
    .nonempty("IFSC Code is required"),
  beneficiaryName: z
    .string()
    .nonempty("Beneficiary Name is required")
    .min(2, "Beneficiary Name must be at least 2 characters"),
  withdrawAmount: z.coerce.number().min(1, {
    message: "Amount must be greater than 0",
  }),
  transactionId: z
    .string()
    .optional()
    .refine((val) => !/\s/.test(val || ""), {
      message: "Transaction ID cannot contain space characters",
    }),
  reason: z.string().optional(),
  secure_url: z.string().optional(),
  public_id: z.string().optional(),
});

export const AcceptWithdrawalSchema = z.object({
  transactionId: z
    .string()
    .min(1, "Transaction ID is required")
    .refine((val) => !/\s/.test(val), {
      message: "Transaction ID cannot contain spaces",
    }),
  image: z
    .custom<FileList>()
    .transform((val) => {
      if (val instanceof File) return val;
      if (val instanceof FileList) return val[0];
      return null;
    })
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: "Not a file",
        });

        return z.NEVER;
      }

      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size allowed is 5MB",
        });
      }

      if (
        !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
          file.type
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be an image (jpeg, jpg, png, webp)",
        });
      }
    })
    .pipe(z.custom<File>()),
});

export const RejectWithdrawalSchema = z.object({
  reason: z.string().min(10, { message: "Minimum of 10 characters required" }),
});

export const BankDetailsSchema = z.object({
  userId: z.string(),
  upiid: z.string().min(1, {
    message: "UPI ID is required",
  }),
  upinumber: z.string().min(1, {
    message: "UPI Number is required",
  }),
  accountDetails: z.string().min(1, {
    message: "Account Details is required",
  }),
  ifsccode: z.string().min(1, {
    message: "IFSC Code is required",
  }),
  accountType: z.string().min(1, {
    message: "Account Type is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  bankName: z.string().min(1, {
    message: "Bank Name is required",
  }),
  image: z
    .custom<FileList>()
    .transform((val) => {
      if (val instanceof File) return val;
      if (val instanceof FileList) return val[0];
      return null;
    })
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: "Not a file",
        });

        return z.NEVER;
      }

      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size allowed is 5MB",
        });
      }

      if (
        !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
          file.type
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be an image (jpeg, jpg, png, webp)",
        });
      }
    })
    .pipe(z.custom<File>()),
});

export const RejectInvoiceSchema = z.object({
  id: z.string(),
  reason: z.string().min(10, { message: "Minimum of 10 characters required" }),
});

export const ProductSchema = z.object({
  userId: z.string(),
  productName: z
    .string()
    .min(1, {
      message: "Product name is required",
    })
    .toLowerCase(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .toLowerCase(),
  price: z.coerce
    .number()
    .min(1, {
      message: "Price must be greater than 0",
    })
    .nonnegative(),
  minProduct: z.coerce
    .number()
    .min(1, {
      message: "Minimum product must be greater than 0",
    })
    .nonnegative(),
  maxProduct: z.coerce
    .number()
    .min(1, {
      message: "Maximum product must be greater than 0",
    })
    .nonnegative(),
  stock: z.coerce
    .number()
    .min(1, {
      message: "Daily stock must be greater than 0",
    })
    .nonnegative(),
  sheetLink: z
    .string()
    .url({ message: "A valid URL for the sheet link is required" })
    .regex(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/, {
      message: "Sheet link must be a valid Google Sheets URL",
    }),
  sheetName: z.coerce.string().nonempty("Sheet Name is required"),
});

export const OrderSchema = z.object({
  id: z.string(),
  walletId:z.string(),
  products: z.array(
    z.object({
      name: z.string().min(1, { message: "Product Name is required" }),
      quantity: z.coerce.number().min(1, { message: "Quantity is required" }),
    }),
    
  ),
  price: z.coerce.number().gte(0),
});

export const FeedbackSchema = z.object({
  orderId: z
    .string()
    .min(10, {
      message: "The Order Id must be at least 10 character long",
    })
    .max(10, {
      message: "OrderId must not exceed 10 characters long",
    }),
  feedback: z.string().optional(),
  userId: z.string(),
  file: z
    .custom<FileList>()
    .transform((val) => {
      if (val instanceof File) return val;
      if (val instanceof FileList) return val[0];
      return null;
    })
    .superRefine((file, ctx) => {
      if (file && file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size allowed is 5MB",
        });
      }
    })
    .pipe(z.custom<File>())
    .optional(),
});

export const FeedbackFileSchema = z.object({
  orderId: z
    .string()
    .min(10, {
      message: "The Order Id must be at least 10 character long",
    })
    .max(10, {
      message: "OrderId must not exceed 10 characters long",
    }),
  userId: z.string(),
  file: z
    .custom<FileList>()
    .transform((val) => {
      if (val instanceof File) return val;
      if (val instanceof FileList) return val[0];
      return null;
    })
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: "Not a file",
        });

        return z.NEVER;
      }

      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size allowed is 5MB",
        });
      }
    })
    .pipe(z.custom<File>()),
});

export const AcceptOrderSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  files: z
    .array(
      z
        .custom<File>()
        .transform((val) => {
          if (val instanceof File) return val;
          return null;
        })
        .superRefine((file, ctx) => {
          if (!(file instanceof File)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              fatal: true,
              message: "Not a file",
            });

            return z.NEVER;
          }

          if (file.size > 15 * 1024 * 1024) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Max file size allowed is 15MB",
            });
          }
        })
    )
    .refine((files) => files.length > 0, {
      message: "At least one file must be provided",
      path: ["files"],
    })
    .optional(),
});

export const RejectOrderSchema = z.object({
  id: z.string(),
  reason: z.string().min(10, { message: "Minimum of 10 characters required" }),
  userId: z.string(),
  orderId: z.string(),
  amount: z.coerce.number(),
});

export const EditProductFormSchema = z.object({
  id: z.string(),
  productName: z
    .string()
    .min(1, {
      message: "Product name is required",
    })
    .toLowerCase()
    .optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  price: z.coerce
    .number()
    .min(1, {
      message: "Price must be greater than 0",
    })
    .nonnegative()
    .optional(),
  stock: z.coerce.number().nonnegative(),
  minProduct: z.coerce.number().nonnegative().optional(),
  maxProduct: z.coerce.number().nonnegative().optional(),
  sheetLink: z.coerce
    .string()
    .url({ message: "A valid URL for the sheet link is required" })
    .regex(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/, {
      message: "Sheet link must be a valid Google Sheets URL",
    })
    .optional(),
  sheetName: z.coerce.string().nonempty("Sheet Name is required").optional(),
});

export const NewsSchema = z.object({
  userId: z.string(),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .max(500, { message: "Content must not exceed 500 characters" }),
});

export const EditNewsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .max(500, { message: "Content must not exceed 500 characters" }),
});

export const ProUserSchema = z.object({
  userId: z.string(),
  amount: z.coerce.number(),
  products: z.array(
    z.object({
      name: z.string().min(1, { message: "Product Name is required" }),
      minProduct: z.coerce
        .number()
        .min(1, { message: "Min product is required" })
        .nonnegative(),
      maxProduct: z.coerce
        .number()
        .min(1, {
          message: "Max product must be greater than min product",
        })
        .nonnegative(),
      price: z.coerce.number().nonnegative().min(1, {
        message: "Price must be greater than zero",
      }),
    })
  ).optional(),
});

export const editProUserSchema = z.object({
  userId: z.string(),
  amount: z.coerce.number().optional(),
  products: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Product Name is required" }),
        minProduct: z.coerce
          .number()
          .min(1, { message: "Min product is required" })
          .nonnegative(),
        maxProduct: z.coerce
          .number()
          .min(1, {
            message: "Max product must be greater than min product",
          })
          .nonnegative(),
        price: z.coerce.number().nonnegative().min(1, {
          message: "Price must be greater than zero",
        }),
      })
    )
    .optional(),
});

export const ReplySchema = z.object({
  orderId: z.string(),
  reply: z.string().min(1, { message: "Reply is required" }),
  feedback: z.string(),
});

export const ReplyFileSchema = z.object({
  orderId: z
    .string()
    .min(10, {
      message: "The Order Id must be at least 10 character long",
    })
    .max(10, {
      message: "OrderId must not exceed 10 characters long",
    }),
  file: z
    .custom<FileList>()
    .transform((val) => {
      if (val instanceof File) return val;
      if (val instanceof FileList) return val[0];
      return null;
    })
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: "Not a file",
        });

        return z.NEVER;
      }

      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size allowed is 5MB",
        });
      }
    })
    .pipe(z.custom<File>()),
});

export const AddSupportLinkForm = z.object({
  userId: z.string(),
  link: z.string().includes("https://").min(1, {
    message: "Please enter the support link",
  }),
});

export const ManagePaymentModeSchema = z.object({
  userId: z.string(),
  paymentType: z.string().toUpperCase().optional(),
});

export const AutomationStateSchema = z.object({
  newState: z.boolean(),
  userId: z.string().nonempty("User ID is required"),
});
