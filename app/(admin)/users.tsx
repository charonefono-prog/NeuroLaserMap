import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Api from "@/lib/_core/api";

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'professional' | 'admin';
  isApproved: boolean;
}

export default function AdminUsersScreen() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const colors = useColors();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.getAdminUsers(); // Need to create this API endpoint
      setUsers(response.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'admin') {
      fetchUsers();
    } else if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      setError("Acesso negado. Você não tem permissão para visualizar esta página.");
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user, fetchUsers]);

  const handleApproveToggle = async (userId: number, currentStatus: boolean) => {
    try {
      await Api.updateUserApproval(userId, !currentStatus); // Need to create this API endpoint
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Failed to toggle approval:", err);
      setError("Erro ao atualizar status de aprovação.");
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'user' | 'professional' | 'admin') => {
    try {
      await Api.updateUserRole(userId, newRole); // Need to create this API endpoint
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Failed to update role:", err);
      setError("Erro ao atualizar função do usuário.");
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-muted">Carregando usuários...</Text>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <Text className="text-red-500 text-center">{error}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView>
        <Text className="text-2xl font-bold text-foreground mb-4">Gerenciamento de Usuários</Text>
        {users.length === 0 ? (
          <Text className="text-muted">Nenhum usuário encontrado.</Text>
        ) : (
          <View className="gap-4">
            {users.map((u) => (
              <View key={u.id} className="bg-surface rounded-lg p-4 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">{u.name || u.email}</Text>
                  <Text className="text-sm text-muted">{u.email}</Text>
                  <Text className="text-sm text-muted">Função: {u.role}</Text>
                  <Text className="text-sm text-muted">Status: {u.isApproved ? 'Aprovado' : 'Pendente'}</Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleApproveToggle(u.id, u.isApproved)}
                    className={`rounded-lg p-2 ${u.isApproved ? 'bg-red-500' : 'bg-green-500'}`}
                  >
                    <Text className="text-white">{u.isApproved ? 'Desaprovar' : 'Aprovar'}</Text>
                  </TouchableOpacity>
                  {/* Role Change - simplified for now, could be a dropdown */}
                  {u.role !== 'admin' && (
                    <TouchableOpacity
                      onPress={() => handleRoleChange(u.id, u.role === 'user' ? 'professional' : 'user')}
                      className="bg-blue-500 rounded-lg p-2"
                    >
                      <Text className="text-white">Mudar para {u.role === 'user' ? 'Profissional' : 'Usuário'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
