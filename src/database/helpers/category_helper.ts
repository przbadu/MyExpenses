import {Q} from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import {formatDateColumn, lineChartFilterProps} from '.';
import {DefaultDateFormat, generateColor} from '../../lib';
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

export const categoryWithTransactionInfo = (
  filter: lineChartFilterProps | null = null,
) => {
  const _dateFormat = 'YYYY-MM-DD';
  let where = '';
  let startTime;
  const endTime = dayjs().format(_dateFormat);

  if (filter === 'w') {
    startTime = dayjs().startOf('week').format(_dateFormat);
  } else if (filter === 'm') {
    startTime = dayjs().startOf('month').format(_dateFormat);
  } else if (filter === 'q') {
    startTime = dayjs().startOf('quarter').format(_dateFormat);
  } else if (filter === 'y') {
    startTime = dayjs().startOf('year').format(_dateFormat);
  }

  if (startTime && endTime) {
    where = ` WHERE ${formatDateColumn(
      '%Y-%m-%d',
    )} >= "${startTime}" AND ${formatDateColumn('%Y-%m-%d')} <= "${endTime}"`;
  }

  const query = `
    select
      categories.id,
      categories.name,
      categories.color,
      categories.icon,
      (select sum(amount) from transactions where transaction_type = 'Income' and category_id = categories.id) totalIncome,
      (select sum(amount) from transactions where transaction_type = 'Expense'  and category_id = categories.id) totalExpense,
      count(*) as count
    from transactions
    INNER JOIN categories on categories.id = transactions.category_id
    ${where}
    group by category_id
    order by totalExpense DESC, totalIncome DESC, count DESC;
  `;

  console.log('query', query);
  return categories.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
};

export const saveCategory = async ({
  name,
  color,
  icon = 'shape',
}: CategoryProps) => {
  await database.write(async () => {
    await categories.create(entry => {
      entry.name = name;
      entry.color = color;
      entry.icon = icon;
    });
  });
};

export const updateCategory = async (
  category: Category,
  {name, color, icon = 'shape'}: CategoryProps,
) => {
  await database.write(async () => {
    await category.update(entry => {
      entry.name = name;
      entry.color = color;
      entry.icon = icon;
    });
  });
};

export const deleteCategory = async (category: Category) => {
  await database.write(async () => {
    await category.destroyPermanently();
  });
};

export const setupDefaultCategories = async () => {
  await saveCategory({
    name: 'Electricity',
    color: generateColor(),
    icon: 'lightbulb-on-outline',
  });
  await saveCategory({name: 'Food', color: generateColor(), icon: 'food'});
  await saveCategory({
    name: 'Hospital',
    color: generateColor(),
    icon: 'hospital',
  });
  await saveCategory({
    name: 'Travel',
    color: generateColor(),
    icon: 'train-car',
  });
  await saveCategory({
    name: 'Shopping',
    color: generateColor(),
    icon: 'shopping',
  });
  await saveCategory({name: 'Others', color: generateColor(), icon: 'shape'});
};
