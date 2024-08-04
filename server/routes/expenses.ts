import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

const createPostSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Groceries",
    amount: 50.75,
  },
  {
    id: 2,
    title: "Gas",
    amount: 30.0,
  },
  {
    id: 3,
    title: "Movie tickets",
    amount: 25.5,
  },
];

export const expensesRoute = new Hono()
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    return c.json({ total });
  })
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expenses = await c.req.valid("json");
    fakeExpenses.push({ ...expenses, id: fakeExpenses.length + 1 });
    return c.json(expenses);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const expense = fakeExpenses.find((expense) => expense.id === id);
    if (!expense) return c.notFound();
    return c.json({ expense });
  });
