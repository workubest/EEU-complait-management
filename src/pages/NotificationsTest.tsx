import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NotificationsTest() {
  return (
    <div className="space-y-6">
      <h1>Notifications Test</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test card to check if the components work.</p>
        </CardContent>
      </Card>
    </div>
  );
}