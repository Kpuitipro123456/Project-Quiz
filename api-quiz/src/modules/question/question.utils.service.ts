export const handleOneToManyQueries = (schemas: any[]) => {
  return schemas.map((schema) => {
    return {
      $lookup: {
        from: schema.collection,
        let: {pid: `$${schema.foreignKey}`},
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', {$toObjectId: '$$pid'}],
              },
            },
          },
          {
            $project: {
              id: {
                $toString: '$_id',
              },
              name: 1,
              _id: 0,
              ...(!!schema?.customFields && schema.customFields),
            },
          },
        ],
        as: schema.as,
      },
    };
  });
};

export const handleManyToManyQueries = (schemas: any[]) => {
  return schemas.map((schema) => {
    const custom = {};
    custom[schema.as] = {
      $arrayElemAt: [`$${schema.nest.as}`, 0],
    };
    return {
      $lookup: {
        from: schema.collection,
        let: {pid: {$toString: `$${schema.locationKey}`}},
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [`$${schema.foreignKey}`, '$$pid'],
              },
            },
          },
          {
            $lookup: {
              from: schema.nest.collection,
              let: {pid: `$${schema.nest.foreignKey}`},
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [`$${schema.nest.locationKey}`, {$toObjectId: '$$pid'}],
                    },
                  },
                },
                {
                  $project: {
                    id: {
                      $toString: `$${schema.nest.locationKey}`,
                    },
                    name: 1,
                    _id: 0,
                  },
                },
              ],
              as: schema.nest.as,
            },
          },
          {
            $project: {
              _id: 0,
              ...custom,
            },
          },
        ],
        as: `${schema.as}`,
      },
    };
  });
};
