import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function POST(request) {
    try {
        // Security check - only allow this in development or with admin secret
        const { adminSecret } = await request.json();

        // ADMIN_SECRET=TeamBlitzAdminSecret2025ProductionReady
        if (adminSecret !== "TeamBlitzAdminSecret2025ProductionReady") {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        console.log('🚀 Creating Super Admin user...');

        // Check if super admin user already exists
        const existingSuperAdmin = await User.findOne({ email: 'itisaddy7@gmail.com' });

        if (existingSuperAdmin) {
            console.log('⚠️  Super Admin user already exists!');
            return NextResponse.json({
                message: 'Super Admin user already exists',
                user: existingSuperAdmin.toJSON()
            });
        }

        // Create super admin user
        const superAdminUser = new User({
            username: 'superadmin',
            email: 'itisaddy7@gmail.com',
            password: 'TeamBlitz2025!',
            role: 'super_admin',
            isActive: true
        });

        // Save to database
        await superAdminUser.save();

        console.log('✅ Super Admin user created successfully!');

        // Also create allowed email entry
        const { adminDb } = await import('@/utils/firebaseAdmin');
        const allowedEmailData = {
            email: 'itisaddy7@gmail.com',
            status: 'allowed',
            addedBy: 'system',
            addedAt: new Date(),
            updatedAt: new Date()
        };

        await adminDb.collection('allowed_emails').add(allowedEmailData);
        console.log('✅ Added to allowed emails list');

        return NextResponse.json({
            message: 'Super Admin user created successfully',
            user: superAdminUser.toJSON(),
            credentials: {
                email: 'itisaddy7@gmail.com',
                password: 'TeamBlitz2025!'
            }
        });

    } catch (error) {
        console.error('❌ Error creating super admin user:', error);
        return NextResponse.json(
            { error: 'Failed to create super admin user: ' + error.message },
            { status: 500 }
        );
    }
}