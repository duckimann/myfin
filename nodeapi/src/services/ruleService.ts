import { prisma } from "../config/prisma.js";
import Logger from "../utils/Logger.js";
import ConvertUtils from "../utils/convertUtils.js";
import AccountService from "./accountService.js";
import EntityService from "./entityService.js";
import CategoryService from "./categoryService.js";
import { Prisma } from "@prisma/client";

const Rule = prisma.rules;

const getAllRulesForUser = async (userId: bigint) => {
  const rules = await Rule.findMany({
    where: { users_user_id: userId }
  });

  rules.forEach((rule) => {
    (rule.matcher_amount_value as any) = rule.matcher_amount_value
      ? ConvertUtils.convertBigIntegerToFloat(rule.matcher_amount_value)
      : undefined;

    (rule.assign_is_essential as any) = +rule.assign_is_essential;
  });

  const categories = await CategoryService.getAllCategoriesForUser(userId);
  const accounts = await AccountService.getAccountsForUser(userId);
  const entities = await EntityService.getAllEntitiesForUser(userId);

  return {
    rules,
    categories,
    entities,
    accounts
  };
};

const createRule = async (userId: bigint, rule: Prisma.rulesCreateInput) =>
  Rule.create({
    data: {
      users_user_id: userId,
      matcher_description_operator: rule.matcher_description_operator,
      matcher_description_value: rule.matcher_description_value,
      matcher_amount_operator: rule.matcher_amount_operator,
      matcher_amount_value: ConvertUtils.convertFloatToBigInteger(
        rule.matcher_amount_value),
      matcher_type_operator: rule.matcher_type_operator,
      matcher_type_value: rule.matcher_type_value,
      matcher_account_to_id_operator: rule.matcher_account_to_id_operator,
      matcher_account_to_id_value: rule.matcher_account_to_id_value,
      matcher_account_from_id_operator: rule.matcher_account_from_id_operator,
      matcher_account_from_id_value: rule.matcher_account_from_id_value,
      assign_category_id: rule.assign_category_id,
      assign_entity_id: rule.assign_entity_id,
      assign_account_to_id: rule.assign_account_to_id,
      assign_account_from_id: rule.assign_account_from_id,
      assign_type: rule.assign_type,
      assign_is_essential: rule.assign_is_essential
    }
  });

const updatedRule = async (rule: Prisma.rulesUpdateInput, dbClient = prisma) => {
  Logger.addStringifiedLog(rule);
  return dbClient.rules.update({
    where: {
      rule_id_users_user_id: {
        rule_id: Number(rule.rule_id),
        users_user_id: Number(rule.users_user_id)
      }
    },
    data: {
      matcher_description_operator: rule.matcher_description_operator,
      matcher_description_value: rule.matcher_description_value,
      matcher_amount_operator: rule.matcher_amount_operator,
      matcher_amount_value: ConvertUtils.convertFloatToBigInteger(
        Number(rule.matcher_amount_value)),
      matcher_type_operator: rule.matcher_type_operator,
      matcher_type_value: rule.matcher_type_value,
      matcher_account_to_id_operator: rule.matcher_account_to_id_operator,
      matcher_account_to_id_value: rule.matcher_account_to_id_value,
      matcher_account_from_id_operator: rule.matcher_account_from_id_operator,
      matcher_account_from_id_value: rule.matcher_account_from_id_value,
      assign_category_id: rule.assign_category_id,
      assign_entity_id: rule.assign_entity_id,
      assign_account_to_id: rule.assign_account_to_id,
      assign_account_from_id: rule.assign_account_from_id,
      assign_type: rule.assign_type,
      assign_is_essential: rule.assign_is_essential
    }
  });
};

const deleteRule = async (userId: bigint, ruleId: bigint) =>
  Rule.delete({
    where: {
      rule_id_users_user_id: {
        rule_id: ruleId,
        users_user_id: userId
      }
    }
  });

const getCountOfUserRules = async (userId, dbClient = prisma) => dbClient.rules.count({
  where: { users_user_id: userId }
});

export default {
  getAllRulesForUser,
  createRule,
  deleteRule,
  updatedRule,
  getCountOfUserRules
};
