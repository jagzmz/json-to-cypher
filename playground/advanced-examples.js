// Advanced examples for JSON2Cypher mapper

// Example 1: Nested Data Structure - Posts with Comments
const postsWithCommentsData = [
    {
        postId: "p1",
        title: "Intro to Graphs",
        body: "Graphs are cool...",
        comments: [
            { commentId: "c1", commentText: "Great post!", user: "Alice" },
            { commentId: "c2", commentText: "Very informative.", user: "Bob" }
        ]
    },
    {
        postId: "p2",
        title: "Deep Dive into Cypher",
        body: "Let's look at MATCH...",
        comments: [
            { commentId: "c3", commentText: "Needs more examples.", user: "Charlie" }
        ]
    }
];

const postsWithCommentsSchema = {
    iterationMode: 'collection',
    nodes: [
        {
            type: 'Post',
            idStrategy: 'fromData',
            idField: 'postId',
            properties: [
                { name: 'title', path: 'title' },
                { name: 'content', path: 'body' }
            ]
        }
    ],
    relationships: [],
    subMappings: [
        {
            sourceDataPath: 'comments',
            iterationMode: 'collection',
            nodes: [
                {
                    type: 'Comment',
                    idStrategy: 'fromData',
                    idField: 'commentId',
                    properties: [
                        { name: 'text', path: 'commentText' },
                        { name: 'author', path: 'user' }
                    ]
                }
            ],
            relationships: [
                {
                    type: 'HAS_COMMENT',
                    from: { path: '$parent.Post.id' },
                    to: { path: '$current.Comment.id' }
                }
            ]
        }
    ]
};

// Example 2: Reference Nodes - Products with Categories
const productsWithCategoriesData = [
    {
        productId: "prod1",
        name: "Smartphone",
        price: 799.99,
        category: "Electronics",
        tags: ["mobile", "tech", "gadget", "appliance"]
    },
    {
        productId: "prod2",
        name: "Laptop",
        price: 1299.99,
        category: "Electronics",
        tags: ["computer", "tech", "work", "appliance"]
    },
    {
        productId: "prod3",
        name: "Coffee Maker",
        price: 89.99,
        category: "Kitchen",
        tags: ["home", "appliance"]
    }
];

const productsWithCategoriesSchema = {
    iterationMode: 'collection',
    nodes: [
        {
            type: 'Product',
            idStrategy: 'fromData',
            idField: 'productId',
            properties: [
                { name: 'name', path: 'name' },
                { name: 'price', path: 'price', type: 'float' }
            ]
        },
        {
            type: 'Category',
            idStrategy: 'fromData',
            idField: 'category',
            isReference: true,
            properties: [
                { name: 'name', path: 'category' }
            ]
        }
    ],
    relationships: [
        {
            type: 'IN_CATEGORY',
            from: { path: '$current.Product.id' },
            to: { path: '$current.Category.id' }
        }
    ],
    subMappings: [
        {
            sourceDataPath: 'tags',
            iterationMode: 'collection',
            nodes: [
                {
                    type: 'Tag',
                    idStrategy: 'fromData',
                    idField: '.',
                    isReference: true,
                    properties: [{ name: 'name', path: '.' }],
                },
            ],
            relationships: [
                {
                    type: 'HAS_TAG',
                    from: { path: '$parent.Product.id' },
                    to: { path: '$current.Tag.id' }
                }
            ]
        }
    ]
};

// Example 3: Complex Relationships - Orders with Products and Customers
const ordersData = [
    {
      orderId: "o1",
      date: "2023-05-15",
      customer: {
        customerId: "cust1",
        name: "John Doe",
        email: "john@example.com",
      },
      items: [
        { productId: "prod1", quantity: 1, price: 799.99, product:{ name: "Smartphone" } },
        { productId: "prod3", quantity: 2, price: 89.99, product:{ name: "Coffee Maker" } },
      ],
      status: "completed",
    },
    {
      orderId: "o2",
      date: "2023-05-16",
      customer: {
        customerId: "cust2",
        name: "Jane Smith",
        email: "jane@example.com",
      },
      items: [{ productId: "prod2", quantity: 1, price: 1299.99, product:{ name: "Laptop" } }],
      status: "processing",
    },
  ];

const ordersSchema = {
    iterationMode: "collection",
    nodes: [
      {
        type: "Order",
        idStrategy: "fromData",
        idField: "orderId",
        properties: [
          { name: "date", path: "date", type: "date" },
          { name: "status", path: "status" },
        ],
      },
      {
        type: "Customer",
        idStrategy: "fromData",
        idField: "customer.customerId",
        properties: [
          { name: "name", path: "customer.name" },
          { name: "email", path: "customer.email" },
        ],
      },
      {
        type: "Status",
        idStrategy: "fromData",
        idField: "status",
        isReference: true,
        properties: [{ name: "name", path: "status" }],
      },
    ],
    relationships: [
      {
        type: "PLACED_BY",
        from: { path: "$current.Order.id" },
        to: { path: "$current.Customer.id" },
      },
      {
        type: "HAS_STATUS",
        from: { path: "$current.Order.id" },
        to: { path: "$current.Status.id" },
      },
    ],
    subMappings: [
      {
        sourceDataPath: "items",
        iterationMode: "collection",
        nodes: [
          {
            type: "OrderItem",
            idStrategy: "uuid",
            properties: [
              { name: "quantity", path: "quantity", type: "integer" },
              { name: "price", path: "price", type: "float" },
            ],
          },
          {
            type: "Product", // Assuming Product nodes exist or are merged
            idStrategy: "fromData",
            idField: "productId",
            isReference: true,
            properties: [
              { name: "name", path: "product.name" },
            ],
          },
        ],
        relationships: [
          {
            type: "CONTAINS",
            from: { path: "$parent.Order.id" },
            to: { path: "$current.OrderItem.id" },
          },
          {
            type: "IS_PRODUCT",
            from: { path: "$current.OrderItem.id" },
            to: { path: "$data.productId", nodeType: "Product" },
          },
        ],
      },
    ],
  };

// Make these examples available to the main script
window.advancedExamples = {
    postsWithComments: {
        data: postsWithCommentsData,
        schema: postsWithCommentsSchema,
        title: "Blog Posts with Comments"
    },
    productsWithCategories: {
        data: productsWithCategoriesData,
        schema: productsWithCategoriesSchema,
        title: "Products with Categories and Tags"
    },
    orders: {
        data: ordersData,
        schema: ordersSchema,
        title: "Orders with Customers and Products"
    }
}; 