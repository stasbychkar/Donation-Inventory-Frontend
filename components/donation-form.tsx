"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Donation } from "@/app/page"

interface DonationFormProps {
  onSubmit: (donation: Omit<Donation, "id">) => void
  initialData?: Donation
  isEditing?: boolean
  onCancel?: () => void
}

const donationTypes = ["money", "food", "clothing", "books", "toys", "electronics", "furniture", "medical", "other"]

export function DonationForm({ onSubmit, initialData, isEditing, onCancel }: DonationFormProps) {
  const [formData, setFormData] = useState({
    donor_name: "",
    donation_type: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    console.log("[v0] initialData changed:", initialData)
    if (initialData) {
      console.log("[v0] Setting form data with:", {
        donor_name: initialData.donor_name,
        donation_type: initialData.donation_type,
        amount: initialData.amount.toString(),
        date: initialData.date,
      })
      setFormData({
        donor_name: initialData.donor_name,
        donation_type: initialData.donation_type,
        amount: initialData.amount.toString(),
        date: initialData.date,
      })
    } else {
      console.log("[v0] Resetting form data")
      // Reset form when no initial data (e.g., after cancel or switching to add mode)
      setFormData({
        donor_name: "",
        donation_type: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [initialData])

  useEffect(() => {
    console.log("[v0] formData state:", formData)
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: Number.parseFloat(formData.amount),
    })

    if (!isEditing) {
      setFormData({
        donor_name: "",
        donation_type: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      donor_name: "",
      donation_type: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    })
    onCancel?.()
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? "Edit Donation" : "Add New Donation"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="donor_name">Donor Name</Label>
            <Input
              id="donor_name"
              placeholder="Enter donor name"
              value={formData.donor_name}
              onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
              required
              className="bg-background"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donation_type">Type of Donation</Label>
            <Select
              key={formData.donation_type || "empty"}
              value={formData.donation_type}
              onValueChange={(value) => setFormData({ ...formData, donation_type: value })}
              required
            >
              <SelectTrigger id="donation_type" className="bg-background">
                <SelectValue placeholder="Select donation type" />
              </SelectTrigger>
              <SelectContent>
                {donationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="e.g., 100.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date of Donation</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              {isEditing ? "Update Donation" : "Add Donation"}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
