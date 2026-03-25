import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PublishScreen() {
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([
    { name: "Carlos Charone", email: "charonefono@icloud.com", role: "Proprietário" },
    { name: "Ada Seixas", email: "adasoares@hotmail.com", role: "Pessoal" },
  ]);

  const handleInvite = () => {
    if (email && !invitedUsers.find(u => u.email === email)) {
      setInvitedUsers([...invitedUsers, { name: email.split('@')[0], email, role: "Convidado" }]);
      setEmail("");
    }
  };

  const removeUser = (emailToRemove: string) => {
    setInvitedUsers(invitedUsers.filter(u => u.email !== emailToRemove));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.foreground }]}>Publicar</Text>
        
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.muted }]}>URL pública</Text>
          <View style={[styles.urlContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.urlText, { color: colors.foreground }]}>www.sparkvozapp.com</Text>
            <View style={styles.urlIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="content-copy" size={20} color={colors.muted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="smartphone" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.addDomain}>
            <MaterialIcons name="add" size={20} color={colors.primary} />
            <Text style={[styles.addDomainText, { color: colors.primary }]}>Personalizar domínio</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.muted }]}>Visibilidade</Text>
          <TouchableOpacity style={[styles.visibilitySelector, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.visibilityLeft}>
              <MaterialIcons name="lock-outline" size={20} color={colors.foreground} />
              <Text style={[styles.visibilityText, { color: colors.foreground }]}>Somente pessoas convidadas</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.inviteSection}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Digite o endereço de e-mail"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity 
            style={[styles.inviteButton, { backgroundColor: email ? "#71717A" : "#E4E4E7" }]}
            onPress={handleInvite}
            disabled={!email}
          >
            <Text style={[styles.inviteButtonText, { color: email ? "#FFF" : "#A1A1AA" }]}>Convidar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.usersList}>
          {invitedUsers.map((user, index) => (
            <View key={index} style={styles.userItem}>
              <View style={styles.userLeft}>
                <View style={[styles.avatar, { backgroundColor: user.role === "Proprietário" ? "#4ADE80" : "#E2E8F0" }]}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View>
                  <View style={styles.userNameRow}>
                    <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
                    {user.role !== "Proprietário" && user.role !== "Convidado" && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{user.role}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.userEmail, { color: colors.muted }]}>{user.email}</Text>
                </View>
              </View>
              {user.role === "Proprietário" ? (
                <Text style={[styles.roleText, { color: colors.muted }]}>Proprietário</Text>
              ) : (
                <TouchableOpacity onPress={() => removeUser(user.email)}>
                  <MaterialIcons name="close" size={20} color={colors.muted} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  urlText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  urlIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 12,
  },
  addDomain: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  addDomainText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  visibilitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  visibilityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  visibilityText: {
    fontSize: 14,
    marginLeft: 8,
  },
  inviteSection: {
    flexDirection: "row",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  inviteButton: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  inviteButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  usersList: {
    marginTop: 8,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 12,
  },
  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    color: "#4B5563",
    fontWeight: "600",
  },
  roleText: {
    fontSize: 12,
  },
});
