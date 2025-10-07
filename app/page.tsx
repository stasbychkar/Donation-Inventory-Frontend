"use client"

import { useState, useEffect } from "react"
import { DonationForm } from "@/components/donation-form"
import { DonationList } from "@/components/donation-list"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export interface Donation {
  id: number
  donor_name: string
  donation_type: string
  amount: number
  date: string
}

export default function DonationInventoryPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const { toast } = useToast()

  // Fetch donations on mount
  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/donations")
      if (!response.ok) throw new Error("Failed to fetch donations")
      const data = await response.json()
      setDonations(data)
    } catch (error) {
      console.error("Error fetching donations:", error)
      toast({
        title: "Error",
        description: "Failed to load donations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDonation = async (donation: Omit<Donation, "id">) => {
    const tempId = -Date.now()
    const optimisticDonation: Donation = {
      id: tempId,
      ...donation,
    }

    // Optimistically add to UI
    setDonations([optimisticDonation, ...donations])

    try {
      const response = await fetch("/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation),
      })

      if (!response.ok) throw new Error("Failed to create donation")

      const newDonation = await response.json()

      // Replace temporary donation with real one
      setDonations((prev) => prev.map((d) => (d.id === tempId ? newDonation : d)))

      toast({
        title: "Success",
        description: "Donation added successfully.",
      })
    } catch (error) {
      console.error("Error adding donation:", error)

      // Revert optimistic update on error
      setDonations((prev) => prev.filter((d) => d.id !== tempId))

      toast({
        title: "Error",
        description: "Failed to add donation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateDonation = async (id: number, donation: Omit<Donation, "id">) => {
    // Store previous state for rollback
    const previousDonations = [...donations]
    const updatedDonation: Donation = { id, ...donation }

    // Optimistically update UI
    setDonations(donations.map((d) => (d.id === id ? updatedDonation : d)))
    setEditingDonation(null)

    try {
      const response = await fetch(`/donations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation),
      })

      if (!response.ok) throw new Error("Failed to update donation")

      const serverDonation = await response.json()

      // Update with server response
      setDonations((prev) => prev.map((d) => (d.id === id ? serverDonation : d)))

      toast({
        title: "Success",
        description: "Donation updated successfully.",
      })
    } catch (error) {
      console.error("Error updating donation:", error)

      // Revert optimistic update on error
      setDonations(previousDonations)
      setEditingDonation(updatedDonation)

      toast({
        title: "Error",
        description: "Failed to update donation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDonation = async (id: number) => {
    // Store deleted donation for rollback
    const deletedDonation = donations.find((d) => d.id === id)

    // Optimistically remove from UI
    setDonations(donations.filter((d) => d.id !== id))

    try {
      const response = await fetch(`/donations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete donation")

      toast({
        title: "Success",
        description: "Donation deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting donation:", error)

      // Revert optimistic update on error
      if (deletedDonation) {
        setDonations((prev) => [deletedDonation, ...prev])
      }

      toast({
        title: "Error",
        description: "Failed to delete donation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (donation: Donation) => {
    console.log("[v0] handleEdit called with donation:", donation)
    setEditingDonation(donation)
  }

  const handleCancelEdit = () => {
    setEditingDonation(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <DonationForm
              onSubmit={editingDonation ? (data) => handleUpdateDonation(editingDonation.id, data) : handleAddDonation}
              initialData={editingDonation || undefined}
              isEditing={!!editingDonation}
              onCancel={handleCancelEdit}
            />
          </div>

          <div className="lg:col-span-2">
            <DonationList
              donations={donations}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteDonation}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
