
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //regex

const buildListQuery = (query, { searchFields, sortFields, filterFields = [] }) => {
  const filter = {};

  // status type
  filterFields.forEach((field) => {
    if (query[field]) filter[field] = String(query[field]);
  });

  // searching
  if (query.search) {
    const regex = new RegExp(escapeRegex(String(query.search)), 'i');
    filter.$or = searchFields.map((field) => ({ [field]: regex }));
  }

//sorting
  let sort = { createdAt: -1 };
  if (query.sort) {
    const parsed = {};
    String(query.sort)
      .split(',')
      .forEach((item) => {
        const desc = item.startsWith('-');
        const field = desc ? item.slice(1) : item;
       
        if (sortFields.includes(field)) parsed[field] = desc ? -1 : 1;
      });
    if (Object.keys(parsed).length > 0) sort = parsed;
  }

  return { filter, sort };
};

module.exports = buildListQuery;