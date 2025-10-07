import { NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/${params.id}`)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 })
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /donations/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch donation" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/donations/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 })
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PUT /donations/[id]:", error)
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/${params.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Donation not found" }, { status: 404 })
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /donations/[id]:", error)
    return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 })
  }
}
