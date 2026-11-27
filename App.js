import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, FlatList, Keyboard, Platform, SafeAreaView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mis_tareas_v1';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTasks(JSON.parse(raw));
      } catch (e) {
        Alert.alert('Aviso', 'No se pudieron recuperar las tareas guardadas.');
      } finally { setLoaded(true); }
    })();
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
  }, [tasks, loaded]);

  const visibleTasks = useMemo(() => tasks.filter(t =>
    filter === 'all' || (filter === 'pending' ? !t.done : t.done)
  ), [tasks, filter]);
  const pending = tasks.filter(t => !t.done).length;

  function addTask() {
    const title = draft.trim();
    if (!title) return;
    setTasks(current => [{ id: `${Date.now()}-${Math.random()}`, title, done: false }, ...current]);
    setDraft(''); Keyboard.dismiss();
  }
  function toggleTask(id) {
    setTasks(current => current.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function deleteTask(id) {
    Alert.alert('Eliminar tarea', '¿Querés eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setTasks(current => current.filter(t => t.id !== id)) }
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>ORGANIZÁ TU DÍA</Text>
            <Text style={styles.heading}>Mis tareas</Text>
            <Text style={styles.subtitle}>{pending === 0 ? '¡Todo al día!' : `${pending} tarea${pending === 1 ? '' : 's'} pendiente${pending === 1 ? '' : 's'}`}</Text>
          </View>
          <View style={styles.logo}><Text style={styles.logoText}>✓</Text></View>
        </View>

        <View style={styles.addCard}>
          <Text style={styles.sectionTitle}>Nueva tarea</Text>
          <View style={styles.addRow}>
            <TextInput
              value={draft} onChangeText={setDraft} onSubmitEditing={addTask}
              placeholder="¿Qué necesitás hacer?" placeholderTextColor="#9299A8"
              returnKeyType="done" style={styles.input} maxLength={100}
              accessibilityLabel="Descripción de la nueva tarea"
            />
            <TouchableOpacity onPress={addTask} style={styles.addButton} accessibilityRole="button" accessibilityLabel="Agregar tarea">
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Tu lista</Text>
          <Text style={styles.count}>{tasks.length} en total</Text>
        </View>
        <View style={styles.filters}>
          {[['all', 'Todas'], ['pending', 'Pendientes'], ['done', 'Hechas']].map(([key, label]) => (
            <TouchableOpacity key={key} onPress={() => setFilter(key)} style={[styles.filter, filter === key && styles.filterActive]}>
              <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={visibleTasks} keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>✦</Text><Text style={styles.emptyTitle}>{tasks.length ? 'No hay tareas en esta categoría' : 'Todavía no hay tareas'}</Text><Text style={styles.emptyText}>Agregá una tarea arriba para empezar.</Text></View>}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <TouchableOpacity onPress={() => toggleTask(item.id)} style={[styles.check, item.done && styles.checkDone]} accessibilityRole="checkbox" accessibilityState={{ checked: item.done }}>
                <Text style={styles.checkText}>{item.done ? '✓' : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskBody}>
                <Text style={[styles.taskTitle, item.done && styles.taskDone]}>{item.title}</Text>
                <Text style={styles.taskStatus}>{item.done ? 'Completada' : 'Pendiente'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton} accessibilityRole="button" accessibilityLabel={`Eliminar ${item.title}`}>
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <Text style={styles.footer}>Tus tareas se guardan en este dispositivo.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FB', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  eyebrow: { color: '#64748B', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  heading: { color: '#172033', fontSize: 34, fontWeight: '800', marginTop: 5 },
  subtitle: { color: '#64748B', fontSize: 14, marginTop: 4 },
  logo: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#315CE8', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#FFF', fontSize: 30, fontWeight: '800' },
  addCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 17, marginBottom: 25, elevation: 2, shadowColor: '#172033', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  sectionTitle: { color: '#172033', fontSize: 17, fontWeight: '800' },
  addRow: { flexDirection: 'row', marginTop: 13, gap: 10 },
  input: { flex: 1, minHeight: 50, borderRadius: 13, backgroundColor: '#F3F5F9', paddingHorizontal: 14, color: '#172033', fontSize: 15 },
  addButton: { width: 52, borderRadius: 14, backgroundColor: '#315CE8', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#FFF', fontSize: 30, lineHeight: 34, fontWeight: '400' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { color: '#8791A3', fontSize: 12, fontWeight: '600' },
  filters: { flexDirection: 'row', gap: 8, marginTop: 13, marginBottom: 13 },
  filter: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#E9EDF5' },
  filterActive: { backgroundColor: '#315CE8' },
  filterText: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: '#FFF' },
  listContent: { paddingBottom: 12, flexGrow: 1 },
  taskCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1, shadowColor: '#172033', shadowOpacity: 0.035, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  check: { width: 25, height: 25, borderWidth: 2, borderColor: '#C5CDDA', borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: '#315CE8', borderColor: '#315CE8' },
  checkText: { color: '#FFF', fontWeight: '900' },
  taskBody: { flex: 1, marginLeft: 12 },
  taskTitle: { color: '#202A3C', fontSize: 15, fontWeight: '700' },
  taskDone: { color: '#929AAA', textDecorationLine: 'line-through' },
  taskStatus: { color: '#929AAA', fontSize: 11, marginTop: 4 },
  deleteButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  deleteText: { color: '#9AA3B2', fontSize: 25, fontWeight: '300' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 45 },
  emptyIcon: { color: '#315CE8', fontSize: 30, marginBottom: 10 },
  emptyTitle: { color: '#273247', fontSize: 15, fontWeight: '800' },
  emptyText: { color: '#8A94A5', fontSize: 12, marginTop: 6, textAlign: 'center' },
  footer: { textAlign: 'center', color: '#9AA3B2', fontSize: 11, paddingVertical: 10 },
});
