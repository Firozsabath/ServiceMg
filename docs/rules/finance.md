# Finance rules

Apply to finance components, financial dialogs, invoice/quotation services and models, and related reports/exports.

- Trace list/route, create/edit form, payload, preview, saved details, and export/email paths as applicable. Multiple legacy and data-entry implementations coexist.
- Preserve IDs, document numbers, company/branch/machine relationships, item identity, status, and audit fields. Do not generate replacement IDs or infer status transitions from labels.
- Inspect consumers before choosing Invoice.ts or invoice.model.ts. They represent different shapes; frontend refactors must preserve serialized field casing.
- Treat quantities, prices, VAT percentages, charges, and totals as numeric inputs. Reject non-finite values and apply the feature's range rules; display formatting is not validation.
- Preserve agreed calculation order and rounding boundaries. Invoice data entry rounds subtotal, VAT, and line total to two decimals; quotation data entry differs. Changing this needs explicit business requirements and focused examples.
- Some forms default VAT to 5. This is an implementation default, not an authoritative tax rule or instruction to apply that rate universally.
- Keep form totals, preview totals, payloads, and exports consistent. Verify custom items, removal, quantity/price changes, zero values, and fractional amounts.
- Check how the particular flow handles service charges and discounts. Do not infer rules from neighboring components or commented code.
- Separate date-only business values from timestamps. Check timezone effects before using toISOString for filters, invoice dates, or due dates.
- Do not infer stock adjustments from invoice edits. Inventory effects and financial status transitions need the backend's actual contract.
- Preserve branding, numbering, customer/tax details, and document layout. Check long descriptions and multiple pages when modifying PDF/preview templates.
- Email and status changes are business side effects. Use mocks for automated verification, prevent duplicates, and obtain explicit authorization before sending real emails.
