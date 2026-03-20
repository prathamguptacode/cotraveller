import { z } from "zod";
import type { groupFormSchema } from "./schemas";

export type GroupFormSchema = z.infer<typeof groupFormSchema>

