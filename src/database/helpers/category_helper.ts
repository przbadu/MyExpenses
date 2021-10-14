import {Q} from '@nozbe/watermelondb';
import {generateColor} from '../../lib';
import {database} from '../index';
import {Category, CategoryProps} from '../models';

export const categories = database.collections.get(Category.table);

export const observeCategories = () => categories.query().observe();

export const categoryWithExpenseInfo = () => {
  const query = `
    select categories.id, categories.name, categories.color, sum(amount) as sum, count(*) as count
    from transactions
    INNER JOIN categories on categories.id = transactions.category_id
    WHERE transaction_type = 'Expense'
    group by category_id
    order by sum DESC, count DESC;
  `;

  console.log('query', query);
  return categories.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
};

export const categoryWithTransactionInfo = () => {
  const query = `
    select
      categories.id,
      categories.name,
      categories.color,
      (select sum(amount) from transactions where transaction_type = 'Income' and category_id = categories.id) totalIncome,
      (select sum(amount) from transactions where transaction_type = 'Expense'  and category_id = categories.id) totalExpense,
      count(*) as count
    from transactions
    INNER JOIN categories on categories.id = transactions.category_id
    WHERE transaction_type = 'Expense'
    group by category_id
    order by totalExpense DESC, totalIncome DESC, count DESC;
  `;

  console.log('query', query);
  return categories.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
};

export const saveCategory = async ({name, color}: CategoryProps) => {
  await database.write(async () => {
    await categories.create(entry => {
      entry.name = name;
      entry.color = color;
    });
  });
};

export const updateCategory = async (
  category: Category,
  {name, color}: CategoryProps,
) => {
  await database.write(async () => {
    await category.update(entry => {
      entry.name = name;
      entry.color = color;
    });
  });
};

export const deleteCategory = async (category: Category) => {
  await database.write(async () => {
    await category.destroyPermanently();
  });
};

export const setupDefaultCategories = async () => {
  await saveCategory({name: 'Electricity', color: generateColor()});
  await saveCategory({name: 'Food', color: generateColor()});
  await saveCategory({name: 'Medical', color: generateColor()});
  await saveCategory({name: 'Travel', color: generateColor()});
  await saveCategory({name: 'Shopping', color: generateColor()});
  await saveCategory({name: 'Others', color: generateColor()});
  await saveCategory({name: 'Uncategorized', color: generateColor()});
};
