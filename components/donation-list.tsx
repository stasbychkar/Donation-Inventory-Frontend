"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import type { Donation } from "@/app/page"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DonationListProps {
  donations: Donation[]
  isLoading: boolean
  onEdit: (donation: Donation) => void
  onDelete: (id: number) => void
}

export function DonationList({ donations, isLoading, onEdit, onDelete }: DonationListProps) {
  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl">Donation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading donations...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (donations.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl">Donation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No donations yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl">
          Donation Records
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({donations.length} {donations.length === 1 ? "donation" : "donations"})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">{donation.donor_name}</h3>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
                    {donation.donation_type.charAt(0).toUpperCase() + donation.donation_type.slice(1)}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Amount: ${donation.amount.toFixed(2)}</span>
                  <span>•</span>
                  <span>Date: {new Date(donation.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(donation)} className="h-9 w-9">
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit donation</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete donation</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Donation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this donation from {donation.donor_name}? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(donation.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
