import randomColor from 'randomcolor';

import {database} from '../index';
import {Category, CategoryProps} from '../models';

const categories = database.collections.get(Category.table);

export const observeCategories = () => categories.query().observe();

export const saveCategory = async ({name, color}: CategoryProps) => {
  await database.write(async () => {
    await categories.create(entry => {
      entry.name = name;
      entry.color = color;
    });
  });
};

export const setupDefaultCategories = async () => {
  await saveCategory({name: 'Electricity', color: randomColor()});
  await saveCategory({name: 'Food', color: randomColor()});
  await saveCategory({name: 'Medical', color: randomColor()});
  await saveCategory({name: 'Travel', color: randomColor()});
  await saveCategory({name: 'Shopping', color: randomColor()});
  await saveCategory({name: 'Others', color: randomColor()});
  await saveCategory({name: 'Uncategorized', color: randomColor()});
};
