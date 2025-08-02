module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING(500)
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    brand: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 100]
      }
    },
    model: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 100]
      }
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2)
    },
    dimensions: {
      type: DataTypes.JSON // {length, width, height}
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    specifications: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['sku']
      },
      {
        fields: ['categoryId']
      },
      {
        fields: ['price']
      },
      {
        fields: ['averageRating']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['isFeatured']
      }
    ]
  });

  return Product;
};