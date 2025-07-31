import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  await prisma.contactMessage.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned up existing data')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecom-boh.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '+216 12345678',
      address: 'Tunis, Tunisia',
      isActive: true,
    },
  })

  // Create seller users
  const seller1Password = await bcrypt.hash('seller123', 12)
  const seller1 = await prisma.user.create({
    data: {
      email: 'seller1@ecom-boh.com',
      password: seller1Password,
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      role: UserRole.SELLER,
      phone: '+216 23456789',
      address: 'Sfax, Tunisia',
      isActive: true,
    },
  })

  const seller2Password = await bcrypt.hash('seller123', 12)
  const seller2 = await prisma.user.create({
    data: {
      email: 'seller2@ecom-boh.com',
      password: seller2Password,
      firstName: 'Fatma',
      lastName: 'Trabelsi',
      role: UserRole.SELLER,
      phone: '+216 34567890',
      address: 'Sousse, Tunisia',
      isActive: true,
    },
  })

  // Create buyer users
  const buyer1Password = await bcrypt.hash('buyer123', 12)
  const buyer1 = await prisma.user.create({
    data: {
      email: 'buyer1@ecom-boh.com',
      password: buyer1Password,
      firstName: 'Mohamed',
      lastName: 'Dridi',
      role: UserRole.BUYER,
      phone: '+216 45678901',
      address: 'Monastir, Tunisia',
      isActive: true,
    },
  })

  const buyer2Password = await bcrypt.hash('buyer123', 12)
  const buyer2 = await prisma.user.create({
    data: {
      email: 'buyer2@ecom-boh.com',
      password: buyer2Password,
      firstName: 'Amina',
      lastName: 'Hammami',
      role: UserRole.BUYER,
      phone: '+216 56789012',
      address: 'Nabeul, Tunisia',
      isActive: true,
    },
  })

  console.log('👥 Created users')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Électronique',
        description: 'Produits électroniques et gadgets',
        image: '/images/categories/electronics.jpg',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vêtements',
        description: 'Mode et accessoires vestimentaires',
        image: '/images/categories/clothing.jpg',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Maison & Jardin',
        description: 'Articles pour la maison et le jardin',
        image: '/images/categories/home.jpg',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sport & Loisirs',
        description: 'Équipements sportifs et activités de loisirs',
        image: '/images/categories/sports.jpg',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Livres & Éducation',
        description: 'Livres, cours et matériel éducatif',
        image: '/images/categories/books.jpg',
        isActive: true,
      },
    }),
  ])

  console.log('📂 Created categories')

  // Create products
  const products = await Promise.all([
    // Électronique
    prisma.product.create({
      data: {
        title: 'Smartphone Samsung Galaxy S21',
        description: 'Smartphone haut de gamme avec appareil photo professionnel et écran AMOLED 6.2"',
        price: 899.99,
        images: [
          '/images/products/samsung-s21-1.jpg',
          '/images/products/samsung-s21-2.jpg',
          '/images/products/samsung-s21-3.jpg',
        ],
        categoryId: categories[0].id,
        sellerId: seller1.id,
        isApproved: true,
        isActive: true,
        stock: 15,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Laptop Dell Inspiron 15',
        description: 'Ordinateur portable performant avec processeur Intel i7 et 16GB RAM',
        price: 1299.99,
        images: [
          '/images/products/dell-laptop-1.jpg',
          '/images/products/dell-laptop-2.jpg',
        ],
        categoryId: categories[0].id,
        sellerId: seller1.id,
        isApproved: true,
        isActive: true,
        stock: 8,
      },
    }),
    // Vêtements
    prisma.product.create({
      data: {
        title: 'Chemise en coton bio',
        description: 'Chemise élégante en coton bio, confortable et durable',
        price: 45.99,
        images: [
          '/images/products/cotton-shirt-1.jpg',
          '/images/products/cotton-shirt-2.jpg',
        ],
        categoryId: categories[1].id,
        sellerId: seller2.id,
        isApproved: true,
        isActive: true,
        stock: 50,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Jeans slim fit premium',
        description: 'Jeans de qualité premium avec coupe slim et finition soignée',
        price: 89.99,
        images: [
          '/images/products/jeans-1.jpg',
          '/images/products/jeans-2.jpg',
        ],
        categoryId: categories[1].id,
        sellerId: seller2.id,
        isApproved: true,
        isActive: true,
        stock: 25,
      },
    }),
    // Maison & Jardin
    prisma.product.create({
      data: {
        title: 'Lampe de bureau LED',
        description: 'Lampe de bureau moderne avec éclairage LED réglable et design épuré',
        price: 29.99,
        images: [
          '/images/products/desk-lamp-1.jpg',
          '/images/products/desk-lamp-2.jpg',
        ],
        categoryId: categories[2].id,
        sellerId: seller1.id,
        isApproved: true,
        isActive: true,
        stock: 30,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Kit de jardinage complet',
        description: 'Kit complet pour jardinage avec outils de qualité et guide d\'utilisation',
        price: 79.99,
        images: [
          '/images/products/gardening-kit-1.jpg',
          '/images/products/gardening-kit-2.jpg',
        ],
        categoryId: categories[2].id,
        sellerId: seller2.id,
        isApproved: true,
        isActive: true,
        stock: 12,
      },
    }),
    // Sport & Loisirs
    prisma.product.create({
      data: {
        title: 'Vélo de route professionnel',
        description: 'Vélo de route léger et performant pour cyclisme sportif',
        price: 899.99,
        images: [
          '/images/products/road-bike-1.jpg',
          '/images/products/road-bike-2.jpg',
        ],
        categoryId: categories[3].id,
        sellerId: seller1.id,
        isApproved: true,
        isActive: true,
        stock: 5,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Tapis de yoga premium',
        description: 'Tapis de yoga antidérapant et écologique pour pratique confortable',
        price: 39.99,
        images: [
          '/images/products/yoga-mat-1.jpg',
          '/images/products/yoga-mat-2.jpg',
        ],
        categoryId: categories[3].id,
        sellerId: seller2.id,
        isApproved: true,
        isActive: true,
        stock: 40,
      },
    }),
    // Livres & Éducation
    prisma.product.create({
      data: {
        title: 'Cours de programmation React',
        description: 'Cours complet de programmation React avec projets pratiques',
        price: 149.99,
        images: [
          '/images/products/react-course-1.jpg',
          '/images/products/react-course-2.jpg',
        ],
        categoryId: categories[4].id,
        sellerId: seller1.id,
        isApproved: true,
        isActive: true,
        stock: 100,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Livre de cuisine traditionnelle',
        description: 'Recueil de recettes traditionnelles tunisiennes avec photos',
        price: 24.99,
        images: [
          '/images/products/cookbook-1.jpg',
          '/images/products/cookbook-2.jpg',
        ],
        categoryId: categories[4].id,
        sellerId: seller2.id,
        isApproved: true,
        isActive: true,
        stock: 75,
      },
    }),
  ])

  console.log('📦 Created products')

  // Create reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excellent smartphone, très satisfait de mon achat !',
        productId: products[0].id,
        userId: buyer1.id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Très bon rapport qualité-prix, je recommande.',
        productId: products[0].id,
        userId: buyer2.id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Laptop parfait pour le travail et les études.',
        productId: products[1].id,
        userId: buyer1.id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Chemise de bonne qualité, livraison rapide.',
        productId: products[2].id,
        userId: buyer2.id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Jeans parfait, coupe élégante et confortable.',
        productId: products[3].id,
        userId: buyer1.id,
      },
    }),
  ])

  console.log('⭐ Created reviews')

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        productId: products[0].id,
        buyerId: buyer1.id,
        quantity: 1,
        totalPrice: 899.99,
        status: 'DELIVERED',
      },
    }),
    prisma.order.create({
      data: {
        productId: products[2].id,
        buyerId: buyer2.id,
        quantity: 2,
        totalPrice: 91.98,
        status: 'CONFIRMED',
      },
    }),
    prisma.order.create({
      data: {
        productId: products[4].id,
        buyerId: buyer1.id,
        quantity: 1,
        totalPrice: 29.99,
        status: 'SHIPPED',
      },
    }),
  ])

  console.log('📦 Created orders')

  // Create contact messages
  const messages = await Promise.all([
    prisma.contactMessage.create({
      data: {
        senderId: buyer1.id,
        receiverId: seller1.id,
        subject: 'Question sur le smartphone',
        message: 'Bonjour, j\'aimerais savoir si le smartphone est disponible en bleu ?',
        isRead: true,
      },
    }),
    prisma.contactMessage.create({
      data: {
        senderId: seller1.id,
        receiverId: buyer1.id,
        subject: 'Réponse : Couleur smartphone',
        message: 'Bonjour, malheureusement le modèle bleu n\'est plus disponible. Nous avons le noir et le blanc.',
        isRead: false,
      },
    }),
  ])

  console.log('💬 Created contact messages')

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: ${await prisma.user.count()}`)
  console.log(`- Categories: ${await prisma.category.count()}`)
  console.log(`- Products: ${await prisma.product.count()}`)
  console.log(`- Reviews: ${await prisma.review.count()}`)
  console.log(`- Orders: ${await prisma.order.count()}`)
  console.log(`- Messages: ${await prisma.contactMessage.count()}`)
  console.log('\n🔑 Test Accounts:')
  console.log('Admin: admin@ecom-boh.com / admin123')
  console.log('Seller 1: seller1@ecom-boh.com / seller123')
  console.log('Seller 2: seller2@ecom-boh.com / seller123')
  console.log('Buyer 1: buyer1@ecom-boh.com / buyer123')
  console.log('Buyer 2: buyer2@ecom-boh.com / buyer123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 