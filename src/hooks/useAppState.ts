import { useState, useCallback } from "react";
import { FamilyMember, GroceryItem, DayPlan } from "@/lib/types";
import { mockFamilyMembers, mockWeekPlan, mockGroceryList } from "@/lib/mock-data";

export function useAppState() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [weekPlan] = useState<DayPlan[]>(mockWeekPlan);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(mockGroceryList);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [selectedDay, setSelectedDay] = useState(0);

  const toggleGroceryItem = useCallback((id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }, []);

  const login = useCallback(() => setIsAuthenticated(true), []);
  const logout = useCallback(() => setIsAuthenticated(false), []);

  const addFamilyMember = useCallback((member: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, member]);
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    weekPlan,
    groceryList,
    toggleGroceryItem,
    familyMembers,
    addFamilyMember,
    removeFamilyMember,
    selectedDay,
    setSelectedDay,
  };
}
