import { NextRequest, NextResponse } from 'next/server'
import { getUserById, softDeleteUser } from '@/lib/db'

export const runtime = 'nodejs'

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: userId' },
        { status: 400 }
      )
    }

    const user = getUserById(parseInt(userId, 10))
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Soft delete - preserves data for leaderboards
    softDeleteUser(user.id!)

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}