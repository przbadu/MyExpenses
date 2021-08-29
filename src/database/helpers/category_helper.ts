import {database} from '../index';
import {Category, CategoryProps} from '../models';

const categories = database.collections.get(Category.table);

export const observeCategories = () => categories.query().observe();

export const saveCategory = async ({name}: CategoryProps) => {
  await database.write(async () => {
    await categories.create(entry => {
      entry.name = name;
    });
  });
};

export const setupDefaultCategories = async () => {
  await saveCategory({name: 'Electricity'});
  await saveCategory({name: 'Food'});
  await saveCategory({name: 'Medical'});
  await saveCategory({name: 'Travel'});
  await saveCategory({name: 'Shopping'});
};
