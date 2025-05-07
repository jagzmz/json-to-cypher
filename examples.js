#!/usr/bin/env node
/**
 * examples.js
 *
 * Demonstrates various usage examples of the JSON-to-Cypher package.
 *
 * Run:
 *   npm run build
 *   node examples.js
 */
import { JSON2Cypher, TransformerRegistry } from './dist/index.js';

async function runExamples() {
  // Example 1: Basic Users and Companies
  console.log('--- Example 1: Basic Users and Companies ---');
  const basicSchema = {
    nodes: [
      {
        type: 'User',
        idStrategy: 'fromData',
        idField: 'id',
        properties: [
          { name: 'name', path: 'name' },
          { name: 'email', path: 'email' },
          { name: 'signupDate', path: 'createdAt', type: 'date' },
        ],
      },
      {
        type: 'Company',
        idStrategy: 'fromData',
        idField: 'company.id',
        isReference: true,
        properties: [{ name: 'name', path: 'company.name' }],
      },
    ],
    relationships: [
      {
        type: 'WORKS_AT',
        from: { path: '$current.User.id' },
        to: { path: '$current.Company.id' },
      },
    ],
    iterationMode: 'collection',
  };
  const basicData = [
    { id: 'u1', name: 'Alice', email: 'alice@example.com', createdAt: '2023-01-10', company: { id: 'c1', name: 'Innovate Inc.' } },
    { id: 'u2', name: 'Bob', email: 'bob@example.com', createdAt: '2023-02-15', company: { id: 'c2', name: 'Synergy Corp.' } },
    { id: 'u3', name: 'Charlie', email: 'charlie@example.com', createdAt: '2023-03-20', company: { id: 'c1', name: 'Innovate Inc.' } },
  ];
  const basicMapper = new JSON2Cypher(basicSchema);
  const { queries: basicQueries } = await basicMapper.generateQueries(basicData);
  console.log(JSON.stringify(basicQueries, null, 2), '\n');

  // Example 2: Blog Posts with Comments (Nested Data)
  console.log('--- Example 2: Blog Posts with Comments ---');
  const postsWithCommentsSchema = {
    iterationMode: 'collection',
    nodes: [
      {
        type: 'Post',
        idStrategy: 'fromData',
        idField: 'postId',
        properties: [
          { name: 'title', path: 'title' },
          { name: 'content', path: 'body' },
        ],
      },
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
              { name: 'name', path: 'commentText' },
              { name: 'author', path: 'user' },
            ],
          },
        ],
        relationships: [
          {
            type: 'HAS_COMMENT',
            from: { path: '$parent.Post.id' },
            to: { path: '$current.Comment.id' },
          },
        ],
      },
    ],
  };
  const postsWithCommentsData = [
    {
      postId: 'p1',
      title: 'Intro to Graphs',
      body: 'Graphs are cool...',
      comments: [
        { commentId: 'c1', commentText: 'Great post!', user: 'Alice' },
        { commentId: 'c2', commentText: 'Very informative.', user: 'Bob' },
      ],
    },
    {
      postId: 'p2',
      title: 'Deep Dive into Cypher',
      body: "Let's look at MATCH...",
      comments: [{ commentId: 'c3', commentText: 'Needs more examples.', user: 'Charlie' }],
    },
  ];
  const postsMapper = new JSON2Cypher(postsWithCommentsSchema);
  const { queries: postQueries } = await postsMapper.generateQueries(postsWithCommentsData);
  console.log(JSON.stringify(postQueries, null, 2), '\n');

  // Example 3: Products with Categories and Tags (Reference Nodes)
  console.log('--- Example 3: Products with Categories and Tags ---');
  const productsWithCategoriesSchema = {
    iterationMode: 'collection',
    nodes: [
      {
        type: 'Product',
        idStrategy: 'fromData',
        idField: 'productId',
        properties: [
          { name: 'name', path: 'name' },
          { name: 'price', path: 'price', type: 'float' },
        ],
      },
      {
        type: 'Category',
        idStrategy: 'fromData',
        idField: 'category',
        isReference: true,
        properties: [{ name: 'name', path: 'category' }],
      },
    ],
    relationships: [
      {
        type: 'IN_CATEGORY',
        from: { path: '$current.Product.id' },
        to: { path: '$current.Category.id' },
      },
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
            to: { path: '$current.Tag.id' },
          },
        ],
      },
    ],
  };
  const productsWithCategoriesData = [
    { productId: 'prod1', name: 'Smartphone', price: 799.99, category: 'Electronics', tags: ['mobile', 'tech', 'gadget', 'appliance'] },
    { productId: 'prod2', name: 'Laptop', price: 1299.99, category: 'Electronics', tags: ['computer', 'tech', 'work', 'appliance'] },
    { productId: 'prod3', name: 'Coffee Maker', price: 89.99, category: 'Kitchen', tags: ['home', 'appliance'] },
  ];
  const productsMapper = new JSON2Cypher(productsWithCategoriesSchema);
  const { queries: productQueries } = await productsMapper.generateQueries(productsWithCategoriesData);
  console.log(JSON.stringify(productQueries, null, 2), '\n');

  // Example 4: Orders with Customers, Products, and Complex Relationships
  console.log('--- Example 4: Orders with Customers and Products ---');
  const ordersSchema = {
    iterationMode: 'collection',
    nodes: [
      {
        type: 'Order',
        idStrategy: 'fromData',
        idField: 'orderId',
        properties: [
          { name: 'date', path: 'date', type: 'date' },
          { name: 'status', path: 'status' },
        ],
      },
      {
        type: 'Customer',
        idStrategy: 'fromData',
        idField: 'customer.customerId',
        properties: [
          { name: 'name', path: 'customer.name' },
          { name: 'email', path: 'customer.email' },
        ],
      },
      {
        type: 'Status',
        idStrategy: 'fromData',
        idField: 'status',
        isReference: true,
        properties: [{ name: 'name', path: 'status' }],
      },
    ],
    relationships: [
      {
        type: 'PLACED_BY',
        from: { path: '$current.Order.id' },
        to: { path: '$current.Customer.id' },
      },
      {
        type: 'HAS_STATUS',
        from: { path: '$current.Order.id' },
        to: { path: '$current.Status.id' },
      },
    ],
    subMappings: [
      {
        sourceDataPath: 'customer.friends',
        iterationMode: 'collection',
        nodes: [
          {
            type: 'Customer',
            idStrategy: 'fromData',
            idField: '.',
            isReference: true,
            properties: [],
          },
        ],
        relationships: [
          {
            type: 'IS_FRIEND_OF',
            from: { path: '$parent.Customer.id' },
            to: { path: '$current.Customer.id' },
          },
        ],
      },
      {
        sourceDataPath: 'items',
        iterationMode: 'collection',
        nodes: [
          {
            type: 'OrderItem',
            idStrategy: 'uuid',
            properties: [
              { name: 'quantity', path: 'quantity', type: 'integer' },
              { name: 'price', path: 'price', type: 'float' },
            ],
          },
          {
            type: 'Product',
            idStrategy: 'fromData',
            idField: 'productId',
            isReference: true,
            properties: [{ name: 'name', path: 'product.name' }],
          },
        ],
        relationships: [
          {
            type: 'CONTAINS',
            from: { path: '$parent.Order.id' },
            to: { path: '$current.OrderItem.id' },
          },
          {
            type: 'IS_PRODUCT',
            from: { path: '$current.OrderItem.id' },
            to: { path: '$data.productId', nodeType: 'Product' },
          },
        ],
      },
    ],
  };
  const ordersData = [
    {
      orderId: 'o1',
      date: '2023-05-15',
      customer: { customerId: 'cust1', name: 'John Doe', email: 'john@example.com', friends: ['cust2'] },
      items: [
        { productId: 'prod1', quantity: 1, price: 799.99, product: { name: 'Smartphone' } },
        { productId: 'prod3', quantity: 2, price: 89.99, product: { name: 'Coffee Maker' } },
      ],
      status: 'completed',
    },
    {
      orderId: 'o2',
      date: '2023-05-16',
      customer: { customerId: 'cust2', name: 'Jane Smith', email: 'jane@example.com' },
      items: [{ productId: 'prod2', quantity: 1, price: 1299.99, product: { name: 'Laptop' } }],
      status: 'processing',
    },
  ];
  const ordersMapper = new JSON2Cypher(ordersSchema);
  const { queries: ordersQueries } = await ordersMapper.generateQueries(ordersData);
  console.log(JSON.stringify(ordersQueries, null, 2), '\n');

  // Example 5: Custom Transformer
  console.log('--- Example 5: Custom Transformer Example ---');
  const registry = new TransformerRegistry();
  registry.register('uppercase', value => (typeof value === 'string' ? value.toUpperCase() : value));
  const transformSchema = {
    nodes: [
      {
        type: 'City',
        idStrategy: 'fromData',
        idField: 'id',
        properties: [{ name: 'name', path: 'name', transformerId: 'uppercase' }],
      },
    ],
    relationships: [],
    iterationMode: 'collection',
  };
  const transformData = [
    { id: 'c1', name: 'london' },
    { id: 'c2', name: 'paris' },
  ];
  const transformMapper = new JSON2Cypher(transformSchema, registry);
  const { queries: transformQueries } = await transformMapper.generateQueries(transformData);
  console.log(JSON.stringify(transformQueries, null, 2));
}

runExamples().catch(err => {
  console.error('Error running examples:', err);
  process.exit(1);
});