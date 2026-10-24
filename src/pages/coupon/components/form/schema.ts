import { z } from 'zod';
import { TFunction } from 'i18next';

export const getFormSchema = (t: TFunction<'translation', undefined>) => {
  return z
    .object({
      code: z.string().trim().min(1, t('this_field_is_required')).max(50),
      description: z.string(),
      type: z.enum(['PERCENTAGE', 'FIXED']),
      value: z.number().nullable(),
      minOrderAmount: z.number().nullable(),
      maxDiscountAmount: z.number().nullable(),
      startsAt: z.date({ required_error: t('this_field_is_required') }),
      expiresAt: z.date({ required_error: t('this_field_is_required') }),
      usageLimit: z.number().nullable(),
      perUserLimit: z.number().nullable(),
      isActive: z.boolean(),
      isPublic: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (data.value === null || data.value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('this_field_must_be_greater_than_0'),
          path: ['value'],
        });
      } else if (data.type === 'PERCENTAGE' && data.value > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('coupon.percentage_max'),
          path: ['value'],
        });
      }

      if (data.minOrderAmount === null || data.minOrderAmount < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('coupon.non_negative'),
          path: ['minOrderAmount'],
        });
      }

      if (data.maxDiscountAmount !== null && data.maxDiscountAmount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('this_field_must_be_greater_than_0'),
          path: ['maxDiscountAmount'],
        });
      }

      if (data.usageLimit !== null && (!Number.isInteger(data.usageLimit) || data.usageLimit < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('coupon.positive_integer'),
          path: ['usageLimit'],
        });
      }

      if (
        data.perUserLimit === null ||
        !Number.isInteger(data.perUserLimit) ||
        data.perUserLimit < 1
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('coupon.positive_integer'),
          path: ['perUserLimit'],
        });
      }

      if (data.startsAt >= data.expiresAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('coupon.invalid_date_range'),
          path: ['expiresAt'],
        });
      }
    });
};
